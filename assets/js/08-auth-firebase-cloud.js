const USERNAME_LOGIN_ALIASES_KEY = "akis-budget-username-login-aliases-v1";
let usernameLoginAliases = null;
let authStateChangeSequence = 0;
let userProfileCloudSyncTimer = null;
let authProfileHydrationPending = false;

function initCloud() {
  renderAuthState();

  if (!window.firebase) {
    cloudStatus.textContent = "Firebase dosyaları yüklenemedi. Bağlantıyı kontrol et veya uygulamayı yayınlı adresten aç.";
    return;
  }

  const config = window.AKIS_FIREBASE_CONFIG;

  if (!hasUsableFirebaseConfig(config)) {
    cloudStatus.textContent = "firebase-config.js içindeki Firebase bilgilerini doldurunca bulut girişi aktif olur.";
    return;
  }

  try {
    if (!window.firebase.apps.length) {
      window.firebase.initializeApp(config);
    }

    firebaseAuth = window.firebase.auth();
    firebaseDb = window.firebase.firestore();
    enableFirestoreOfflineCache();
    firebaseAuth.onAuthStateChanged(handleAuthStateChanged);
    cloudStatus.textContent = "Bulut bağlantısı hazır. Hesabınla giriş yapabilirsin.";
  } catch (error) {
    cloudStatus.textContent = `Firebase başlatılamadı: ${error.message}`;
  }
}

function enableFirestoreOfflineCache() {
  if (!firebaseDb || firestorePersistenceEnabled || typeof firebaseDb.enablePersistence !== "function") {
    return;
  }

  firestorePersistenceEnabled = true;
  firebaseDb.enablePersistence({ synchronizeTabs: true }).catch((error) => {
    if (error?.code === "failed-precondition") {
      cloudStatus.textContent = "Bulut onbellegi acik sekmeler nedeniyle sinirli. Veriler yine de esitlenecek.";
      return;
    }

    if (error?.code === "unimplemented") {
      cloudStatus.textContent = "Bu tarayici Firebase yerel onbellegini desteklemiyor. Veriler agdan yuklenecek.";
    }
  });
}

function ensureCloudReady(statusElement = cloudStatus) {
  if (firebaseAuth && firebaseDb) {
    return true;
  }

  initCloud();

  const ready = Boolean(firebaseAuth && firebaseDb);

  if (!ready && statusElement && statusElement !== cloudStatus) {
    statusElement.textContent = cloudStatus.textContent;
  }

  return ready;
}

function hasUsableFirebaseConfig(config) {

  const requiredKeys = ["apiKey", "authDomain", "projectId", "appId"];

  return (
    config &&
    requiredKeys.every((key) => {

      const value = String(config[key] || "");
      return value && !value.includes("BURAYA_") && !value.includes("PROJECT_ID");
    })
  );
}

function showAuthPanel(panelName) {

  const panels = [authForm, signupForm, resetPasswordForm];

  panels.forEach((panel) => {
    if (panel) {
      panel.hidden = panel.dataset.authPanel !== panelName;
    }
  });

  if (panelName === "login") {
    authPassword.value = "";
    setTimeout(() => authEmail?.focus(), 0);
  }
}

function openSignupPanel() {

  const loginValue = authEmail.value.trim();

  if (loginValue.includes("@")) {
    signupEmail.value = loginValue.toLowerCase();
    signupUsername.value = "";
  } else {
    signupUsername.value = loginValue;
    signupEmail.value = "";
  }

  signupPassword.value = "";
  signupPasswordConfirm.value = "";
  signupStatus.textContent = "";
  showAuthPanel("signup");
  setTimeout(() => (signupEmail.value ? signupUsername.focus() : signupEmail.focus()), 0);
}

function openResetPanel() {

  const loginValue = authEmail.value.trim();

  resetEmail.value = loginValue.includes("@") ? loginValue.toLowerCase() : findUsernameLoginAlias(loginValue)?.email || "";
  resetStatus.textContent = "";
  showAuthPanel("reset");
  setTimeout(() => resetEmail.focus(), 0);
}

async function signInWithEmail() {

  const credentials = getAuthCredentials();

  if (!credentials) {
    return;
  }

  if (!ensureCloudReady(signupStatus)) {
    return;
  }

  try {
    cloudStatus.textContent = "Giriş yapılıyor...";
    const result = await firebaseAuth.signInWithEmailAndPassword(credentials.email, credentials.password);
    rememberUsernameLogin(result.user);
    saveLastUsername(getUserDisplayName(result.user) || credentials.username);
  } catch (error) {
    cloudStatus.textContent = getFirebaseErrorMessage(error);
    if (!credentials.username.includes("@") && !findUsernameLoginAlias(credentials.username)
      && ["auth/user-not-found", "auth/wrong-password", "auth/invalid-credential", "auth/invalid-login-credentials"].includes(error.code)) {
      cloudStatus.textContent += " Bu cihazda kullanıcı adı henüz e-postayla eşleşmemiş. Bir kez e-posta adresinle giriş yaptığında kullanıcı adınla da yeni parolanı kullanabilirsin.";
    }
  }
}

async function createAccountWithEmail(event) {
  event.preventDefault();

  const credentials = getSignupCredentials();

  if (!credentials) {
    return;
  }

  if (!ensureCloudReady(resetStatus)) {
    return;
  }

  try {
    signupStatus.textContent = "Hesap oluşturuluyor...";

    const userCredential = await firebaseAuth.createUserWithEmailAndPassword(
      credentials.email,
      credentials.password
    );

    if (userCredential.user) {
      await userCredential.user.updateProfile({ displayName: credentials.username });
      await userCredential.user.reload();
      currentUser = firebaseAuth.currentUser || userCredential.user;
    }

    rememberUsernameLogin(currentUser || userCredential.user);
    saveLastUsername(credentials.username);
    renderAuthState();
    await syncUserProfileToCloud();
    signupStatus.textContent = "Hesap oluşturuldu. Bulut kayıtların hazırlanıyor...";
  } catch (error) {
    signupStatus.textContent = getFirebaseErrorMessage(error);
  }
}

async function sendPasswordReset(event) {
  event.preventDefault();

  const email = resetEmail.value.trim().toLowerCase();

  if (!ensureCloudReady()) {
    return;
  }

  if (!email || !email.includes("@")) {
    resetStatus.textContent = "Parola sıfırlamak için mail adresini yaz.";
    resetEmail.focus();
    return;
  }

  try {
    resetStatus.textContent = "Parola sıfırlama bağlantısı gönderiliyor...";
    await firebaseAuth.sendPasswordResetEmail(email);
    resetStatus.textContent = "Yenileme şifreniz mail adresinize gönderildi.";
  } catch (error) {
    resetStatus.textContent = getFirebaseErrorMessage(error);
  }
}

async function signOutUser() {
  if (!firebaseAuth) {
    return;
  }

  closeProfileModal();
  currentUser = null;
  renderAuthState();
  await firebaseAuth.signOut();
}

function loadProfileContactInfo() {
  try {
    const raw = localStorage.getItem(getStorageKey(PROFILE_CONTACT_STORAGE_KEY));
    const parsed = raw ? JSON.parse(raw) : {};
    return {
      homeAddress: String(parsed?.homeAddress || ""),
      workAddress: String(parsed?.workAddress || ""),
      updatedAt: Math.max(0, Number(parsed?.updatedAt) || 0),
      pendingSync: parsed?.pendingSync === true,
    };
  } catch (_error) {
    return { homeAddress: "", workAddress: "", updatedAt: 0, pendingSync: false };
  }
}

function saveProfileContactInfo(contact = {}, options = {}) {
  const normalized = {
    homeAddress: String(contact?.homeAddress || "").trim(),
    workAddress: String(contact?.workAddress || "").trim(),
    updatedAt: options.updatedAt ?? Math.max(Date.now(), loadProfileContactInfo().updatedAt + 1),
    pendingSync: options.pendingSync ?? true,
  };
  localStorage.setItem(getStorageKey(PROFILE_CONTACT_STORAGE_KEY), JSON.stringify(normalized));
  return normalized;
}

function readCloudProfileContactInfo(data, fallback) {
  return {
    homeAddress: Object.prototype.hasOwnProperty.call(data, "homeAddress") ? String(data.homeAddress || "").trim() : fallback.homeAddress,
    workAddress: Object.prototype.hasOwnProperty.call(data, "workAddress") ? String(data.workAddress || "").trim() : fallback.workAddress,
    updatedAt: Math.max(0, Number(data.profileContactUpdatedAt) || 0),
    pendingSync: false,
  };
}

function applyCloudProfileContactInfo(data = {}) {
  if (!Object.prototype.hasOwnProperty.call(data, "homeAddress") && !Object.prototype.hasOwnProperty.call(data, "workAddress")) return;
  const before = loadProfileContactInfo();
  const incoming = readCloudProfileContactInfo(data, before);
  // Keep pending saves and blurred, unsaved form drafts intact during refreshes.
  if (before.pendingSync || incoming.updatedAt < before.updatedAt) return;
  const contact = saveProfileContactInfo(incoming, { updatedAt: incoming.updatedAt, pendingSync: false });
  if (profileHomeAddress && document.activeElement !== profileHomeAddress && profileHomeAddress.value.trim() === before.homeAddress) profileHomeAddress.value = contact.homeAddress;
  if (profileWorkAddress && document.activeElement !== profileWorkAddress && profileWorkAddress.value.trim() === before.workAddress) profileWorkAddress.value = contact.workAddress;
}

function toggleProfilePasswordFields(forceOpen = null) {
  if (!profilePasswordFields || !profilePasswordSettingsButton) return;
  const nextOpen = typeof forceOpen === "boolean" ? forceOpen : profilePasswordFields.hidden;
  profilePasswordFields.hidden = !nextOpen;
  profilePasswordSettingsButton.setAttribute("aria-expanded", nextOpen ? "true" : "false");
  profilePasswordSettingsButton.classList.toggle("is-open", nextOpen);
  if (nextOpen) setTimeout(() => profileCurrentPassword?.focus(), 10);
}

function fillProfileForm() {
  if (!currentUser || !profileForm) {
    return;
  }

  const contactInfo = loadProfileContactInfo();
  profileUsername.value = getUserDisplayName(currentUser);
  if (profileEmail) profileEmail.value = currentUser.email || "";
  if (profileHomeAddress) profileHomeAddress.value = contactInfo.homeAddress;
  if (profileWorkAddress) profileWorkAddress.value = contactInfo.workAddress;
  profileCurrentPassword.value = "";
  profilePassword.value = "";
  toggleProfilePasswordFields(false);
  profileStatus.textContent = "";
  closeDeleteAccountModal();
  closeConfirmDeleteAccountModal();
  if (deleteUserStatus) {
    deleteUserStatus.textContent = "";
  }
}

function closeProfileModal() {
  if (!profileModal) {
    return;
  }

  profileModal.hidden = true;
}

async function updateProfile(event) {
  event.preventDefault();

  if (!currentUser || !firebaseAuth) {
    profileStatus.textContent = "Profil güncellemek için giriş yapmalısın.";
    return;
  }

  const username = profileUsername.value.trim();
  const contactBefore = loadProfileContactInfo();
  const homeAddress = profileHomeAddress?.value.trim() || "";
  const workAddress = profileWorkAddress?.value.trim() || "";

  const currentPassword = profileCurrentPassword.value;

  const nextPassword = profilePassword.value;

  if (!username) {
    profileStatus.textContent = "Kullanıcı adı boş olamaz.";
    return;
  }

  if (nextPassword && nextPassword.length < 6) {
    profileStatus.textContent = "Yeni şifre en az 6 karakter olmalı.";
    return;
  }

  const usernameChanged = username !== getUserDisplayName(currentUser);
  const contactChanged = homeAddress !== contactBefore.homeAddress || workAddress !== contactBefore.workAddress;

  const passwordChanged = Boolean(nextPassword);

  if (!usernameChanged && !passwordChanged && !contactChanged) {
    profileStatus.textContent = "Güncellenecek bir değişiklik yok.";
    profileForm?.dispatchEvent(new CustomEvent("settings-profile-saved"));
    return;
  }

  if (passwordChanged && !currentPassword) {
    profileStatus.textContent = "Şifre değiştirmek için mevcut şifreni gir.";
    profileCurrentPassword.focus();
    return;
  }

  try {
    profileStatus.textContent = "Profil güncelleniyor...";

    if (passwordChanged) {
      await reauthenticateCurrentUser(currentPassword);
    }

    if (usernameChanged) {
      await currentUser.updateProfile({ displayName: username });
    }

    if (passwordChanged) {
      await currentUser.updatePassword(nextPassword);
    }

    if (contactChanged) {
      saveProfileContactInfo({ homeAddress, workAddress });
      markUserProfileCloudDirty();
    }

    if (usernameChanged || passwordChanged) await currentUser.reload();
    currentUser = firebaseAuth.currentUser || currentUser;
    rememberUsernameLogin(currentUser);
    saveLastUsername(getUserDisplayName(currentUser));
    renderAuthState();
    if (contactChanged && navigator.onLine && typeof syncUserProfileToCloud === "function") {
      await syncUserProfileToCloud();
    }
    if (usernameChanged || passwordChanged) await syncTransactionsToCloud({ replace: true });
    profileCurrentPassword.value = "";
    profilePassword.value = "";
    profileStatus.textContent = loadProfileContactInfo().pendingSync
      ? "Adresler bu cihazda kaydedildi. Bulut eşitlemesi bekleniyor."
      : "Profil güncellendi.";
    profileForm?.dispatchEvent(new CustomEvent("settings-profile-saved"));
  } catch (error) {
    profileStatus.textContent = getFirebaseErrorMessage(error);
  }
}

async function reauthenticateCurrentUser(password) {

  const credential = window.firebase.auth.EmailAuthProvider.credential(currentUser.email, password);
  await currentUser.reauthenticateWithCredential(credential);
}

// Hesap silme akisi: once genel onay, sonra e-posta ile 6 haneli kod dogrulamasi yapilir.
function startDeleteAccountVerification() {
  if (!currentUser || !currentUser.email) {
    if (deleteUserStatus) deleteUserStatus.textContent = "Hesabı silmek için giriş yapmalısın.";
    return;
  }

  if (deleteUserStatus) deleteUserStatus.textContent = "";
  openGenericConfirmModal(
    "Hesabı kalıcı olarak silmek istediğine emin misin?",
    "Bu işlem hesabını, buluttaki kayıtlarını ve cihazdaki oturum verilerini kalıcı olarak siler.",
    () => requestDeleteAccountEmailCode(),
    { confirmLabel: "Evet, devam et", cancelLabel: "Vazgeç" }
  );
}

async function requestDeleteAccountEmailCode({ resend = false } = {}) {
  if (!currentUser || !currentUser.email || deleteCodeRequestInFlight) return;

  deleteCodeRequestInFlight = true;
  if (deleteUserStatus) deleteUserStatus.textContent = resend ? "Yeni doğrulama kodu gönderiliyor..." : "Doğrulama kodu gönderiliyor...";
  if (deleteAccountCodeStatus) deleteAccountCodeStatus.textContent = resend ? "Yeni kod gönderiliyor..." : "Kod gönderiliyor...";
  if (resendDeleteAccountCodeButton) resendDeleteAccountCodeButton.disabled = true;

  try {
    const response = await fetch("/.netlify/functions/account-delete-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "request",
        email: currentUser.email,
        uid: currentUser.uid,
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.challenge) {
      throw new Error(data.error || "Doğrulama kodu gönderilemedi.");
    }

    pendingDeleteEmailChallenge = data.challenge;
    pendingDeleteEmailVerifiedToken = "";
    if (deleteAccountCodeEmail) deleteAccountCodeEmail.textContent = currentUser.email;
    if (deleteAccountCodeInput) deleteAccountCodeInput.value = "";
    if (deleteAccountCodeStatus) deleteAccountCodeStatus.textContent = "Kod e-posta adresine gönderildi. Kod 10 dakika geçerlidir.";
    if (deleteUserStatus) deleteUserStatus.textContent = "";
    if (deleteAccountCodeModal) deleteAccountCodeModal.hidden = false;
    setTimeout(() => deleteAccountCodeInput?.focus(), 0);
  } catch (error) {
    const message = error?.message || "Doğrulama kodu gönderilemedi.";
    if (deleteUserStatus) deleteUserStatus.textContent = message;
    if (deleteAccountCodeStatus && !deleteAccountCodeModal?.hidden) deleteAccountCodeStatus.textContent = message;
  } finally {
    deleteCodeRequestInFlight = false;
    if (resendDeleteAccountCodeButton) resendDeleteAccountCodeButton.disabled = false;
  }
}

function closeDeleteAccountCodeModal() {
  pendingDeleteEmailChallenge = "";
  pendingDeleteEmailVerifiedToken = "";
  if (deleteAccountCodeForm) deleteAccountCodeForm.reset();
  if (deleteAccountCodeStatus) deleteAccountCodeStatus.textContent = "";
  if (deleteAccountCodeModal) deleteAccountCodeModal.hidden = true;
}

async function verifyDeleteAccountEmailCode(event) {
  event?.preventDefault();
  if (!currentUser || !pendingDeleteEmailChallenge) {
    if (deleteAccountCodeStatus) deleteAccountCodeStatus.textContent = "Önce yeni bir doğrulama kodu iste.";
    return;
  }

  const code = String(deleteAccountCodeInput?.value || "").replace(/\D/g, "").slice(0, 6);
  if (code.length !== 6) {
    if (deleteAccountCodeStatus) deleteAccountCodeStatus.textContent = "6 haneli doğrulama kodunu gir.";
    deleteAccountCodeInput?.focus();
    return;
  }

  const submitButton = deleteAccountCodeForm?.querySelector('button[type="submit"]');
  if (submitButton) submitButton.disabled = true;
  if (deleteAccountCodeStatus) deleteAccountCodeStatus.textContent = "Kod doğrulanıyor...";

  try {
    const response = await fetch("/.netlify/functions/account-delete-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "verify",
        email: currentUser.email,
        uid: currentUser.uid,
        code,
        challenge: pendingDeleteEmailChallenge,
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.verified || !data.verifiedToken) {
      throw new Error(data.error || "Doğrulama kodu geçersiz.");
    }

    pendingDeleteEmailVerifiedToken = data.verifiedToken;
    if (deleteAccountCodeStatus) deleteAccountCodeStatus.textContent = "Kod doğrulandı. Hesap silme işlemi hazırlanıyor...";
    await deleteCurrentUserAccountWithEmailVerification();
  } catch (error) {
    if (deleteAccountCodeStatus) deleteAccountCodeStatus.textContent = error?.message || "Doğrulama kodu kontrol edilemedi.";
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
}

async function deleteCurrentUserAccountWithEmailVerification() {
  if (!currentUser || !firebaseAuth || !firebaseDb || !pendingDeleteEmailVerifiedToken) {
    if (deleteAccountCodeStatus) deleteAccountCodeStatus.textContent = "Hesap silme doğrulaması tamamlanamadı.";
    return;
  }

  const user = currentUser;
  try {
    // Firebase, hesap silme gibi kritik islemlerde yakin zamanda giris yapilmis olmasini ister.
    const tokenResult = await user.getIdTokenResult(true);
    const authTime = Number(tokenResult?.claims?.auth_time || 0);
    const authAgeSeconds = authTime ? Math.max(0, Math.floor(Date.now() / 1000) - authTime) : Number.POSITIVE_INFINITY;
    if (authAgeSeconds > 240) {
      throw new Error("E-posta kodu doğrulandı. Firebase güvenliği nedeniyle hesabı silmeden önce çıkış yapıp tekrar giriş yapman gerekiyor. Tekrar giriş yaptıktan sonra aynı işlemi yeniden başlat.");
    }

    if (deleteAccountCodeStatus) deleteAccountCodeStatus.textContent = "Hesap ve bulut kayıtları siliniyor...";
    await deleteUserCloudData(user.uid);
    clearUserLocalData(user.uid);
    await user.delete();
    forgetUsernameLogin(user.uid);
    transactions = [];
    assets = [];
    besAccounts = [];
    borcAlacakKayitlari = [];
    paymentAccounts = [];
    render();
    pendingDeleteEmailChallenge = "";
    pendingDeleteEmailVerifiedToken = "";
    if (deleteAccountCodeModal) deleteAccountCodeModal.hidden = true;
    if (deleteUserStatus) deleteUserStatus.textContent = "";
    if (cloudStatus) cloudStatus.textContent = "Kullanıcı hesabı silindi.";
  } catch (error) {
    if (deleteAccountCodeStatus) deleteAccountCodeStatus.textContent = getFirebaseErrorMessage?.(error) || error?.message || "Hesap silinemedi.";
  }
}

function openDeleteAccountModal() {
  if (!currentUser) {
    deleteUserStatus.textContent = "Kullanıcı silmek için giriş yapmalısın.";
    return;
  }

  pendingDeletePassword = "";
  deleteUserStatus.textContent = "";
  deleteAccountStatus.textContent = "";
  deleteAccountForm.reset();
  deleteAccountModal.hidden = false;
  setTimeout(() => deleteUserPassword.focus(), 0);
}

function closeDeleteAccountModal() {
  if (!deleteAccountModal) {
    return;
  }

  pendingDeletePassword = "";
  deleteAccountForm?.reset();
  if (deleteAccountStatus) {
    deleteAccountStatus.textContent = "";
  }
  deleteAccountModal.hidden = true;
}

function requestDeleteAccountConfirmation(event) {
  event.preventDefault();

  if (!currentUser || !firebaseAuth || !firebaseDb) {
    deleteAccountStatus.textContent = "Kullanıcı silmek için giriş yapmalısın.";
    return;
  }

  const password = deleteUserPassword.value;

  const passwordConfirm = deleteUserPasswordConfirm.value;

  if (!password) {
    deleteAccountStatus.textContent = "Hesabı silmek için şifreni yaz.";
    deleteUserPassword.focus();
    return;
  }

  if (password !== passwordConfirm) {
    deleteAccountStatus.textContent = "Şifre ve şifre onayı aynı olmalı.";
    deleteUserPasswordConfirm.focus();
    return;
  }

  pendingDeletePassword = password;
  deleteAccountModal.hidden = true;
  confirmDeleteAccountStatus.textContent = "";
  confirmDeleteAccountModal.hidden = false;
  setTimeout(() => cancelConfirmDeleteButton.focus(), 0);
}

function closeConfirmDeleteAccountModal() {
  if (!confirmDeleteAccountModal) {
    return;
  }

  pendingDeletePassword = "";
  if (confirmDeleteAccountStatus) {
    confirmDeleteAccountStatus.textContent = "";
  }
  confirmDeleteAccountModal.hidden = true;
}

async function deleteCurrentUserAccount() {
  if (!currentUser || !firebaseAuth || !firebaseDb) {
    confirmDeleteAccountStatus.textContent = "Kullanıcı silmek için giriş yapmalısın.";
    return;
  }

  if (!pendingDeletePassword) {
    confirmDeleteAccountStatus.textContent = "Devam etmek için şifreni yeniden yazmalısın.";
    confirmDeleteAccountModal.hidden = true;
    openDeleteAccountModal();
    return;
  }

  const user = currentUser;

  try {
    confirmDeleteAccountStatus.textContent = "Kullanıcı ve bulut kayıtları siliniyor...";
    await reauthenticateCurrentUser(pendingDeletePassword);
    await deleteUserCloudData(user.uid);
    clearUserLocalData(user.uid);
    await user.delete();
    forgetUsernameLogin(user.uid);
    transactions = [];
    assets = [];
    besAccounts = [];
    borcAlacakKayitlari = [];
    paymentAccounts = [];
    render();
    closeDeleteAccountModal();
    closeConfirmDeleteAccountModal();
    deleteUserStatus.textContent = "";
    cloudStatus.textContent = "Kullanıcı hesabı silindi.";
  } catch (error) {
    confirmDeleteAccountStatus.textContent = getFirebaseErrorMessage(error);
  }
}

async function deleteUserCloudData(userId) {

  const collection = getUserTransactionsCollection(userId);

  const snapshot = await collection.get();

  let batch = firebaseDb.batch();

  let operationCount = 0;

  for (const doc of snapshot.docs) {
    batch.delete(doc.ref);
    operationCount += 1;

    if (operationCount === 450) {
      await batch.commit();
      batch = firebaseDb.batch();
      operationCount = 0;
    }
  }

  batch.delete(firebaseDb.collection("users").doc(userId));

  await batch.commit();
}

function clearUserLocalData(userId) {
  [
    STORAGE_KEY,
    ASSETS_STORAGE_KEY,
    BES_STORAGE_KEY,
    BORC_ALACAK_STORAGE_KEY,
    PAYMENT_ACCOUNTS_STORAGE_KEY,
    DELETED_TRANSACTIONS_STORAGE_KEY,
    DELETED_TRANSACTION_SIGNATURES_STORAGE_KEY,
    DELETED_TRANSFER_TOMBSTONES_STORAGE_KEY,
    DELETED_ASSET_TOMBSTONES_STORAGE_KEY,
    DELETED_BES_TOMBSTONES_STORAGE_KEY,
    SILINEN_BORC_ALACAK_STORAGE_KEY,
    PROFILE_CLOUD_DIRTY_STORAGE_KEY,
  ].forEach((baseKey) => {
    localStorage.removeItem(`${baseKey}-${userId}`);
  });
}

function getAuthCredentials() {

  const username = authEmail.value.trim();

  const password = authPassword.value;

  if (!username || password.length < 6) {
    cloudStatus.textContent = "Kullanıcı adı/e-posta ve en az 6 karakterli şifre gir.";
    return null;
  }

  return { email: usernameToEmail(username), password, username };
}

function getSignupCredentials() {

  const email = signupEmail.value.trim().toLowerCase();

  const username = signupUsername.value.trim();

  const password = signupPassword.value;

  const confirmPassword = signupPasswordConfirm.value;

  if (!email || !email.includes("@")) {
    signupStatus.textContent = "Geçerli bir mail adresi yaz.";
    signupEmail.focus();
    return null;
  }

  if (!username) {
    signupStatus.textContent = "Kullanıcı adı boş olamaz.";
    signupUsername.focus();
    return null;
  }

  if (password.length < 6) {
    signupStatus.textContent = "Şifre en az 6 karakter olmalı.";
    signupPassword.focus();
    return null;
  }

  if (password !== confirmPassword) {
    signupStatus.textContent = "Şifre ve şifre onay aynı olmalı.";
    signupPasswordConfirm.focus();
    return null;
  }

  return { email, username, password };
}

function loadLastUsername() {
  try {
    return localStorage.getItem(LAST_USERNAME_KEY) || "";
  } catch {
    return "";
  }
}

function saveLastUsername(emailOrUsername) {

  const username = emailToUsername(emailOrUsername).trim();

  if (!username) {
    return;
  }

  try {
    localStorage.setItem(LAST_USERNAME_KEY, username);
  } catch {
    // Username memory is only a convenience.
  }
}

function usernameToEmail(username) {

  const value = String(username || "").trim();

  if (value.includes("@")) {
    return value.toLowerCase();
  }

  const knownAccount = findUsernameLoginAlias(value);
  if (knownAccount) return knownAccount.email;

  const safeUsername = normalizeBankText(value).replace(/\s+/g, "");
  return `${safeUsername}@${USERNAME_EMAIL_DOMAIN}`;
}

function normalizeLoginUsername(value) {
  return String(value || "").trim().toLocaleLowerCase("tr-TR").normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i").replace(/\s+/g, " ");
}

function readUsernameLoginAliases() {
  if (usernameLoginAliases !== null) return usernameLoginAliases;
  try {
    const saved = JSON.parse(localStorage.getItem(USERNAME_LOGIN_ALIASES_KEY) || "[]");
    usernameLoginAliases = Array.isArray(saved) ? saved.filter((item) => item
      && typeof item.usernameKey === "string" && typeof item.uid === "string"
      && typeof item.email === "string" && item.email.includes("@"))
      .map((item) => ({ usernameKey: item.usernameKey, uid: item.uid, email: item.email.trim().toLowerCase() }))
      .slice(-30) : [];
  } catch {
    usernameLoginAliases = [];
  }
  return usernameLoginAliases;
}

function findUsernameLoginAlias(username) {
  const key = normalizeLoginUsername(username);
  if (!key || key.includes("@")) return null;
  return readUsernameLoginAliases().find((item) => item.usernameKey === key) || null;
}

function persistUsernameLoginAliases() {
  try {
    localStorage.setItem(USERNAME_LOGIN_ALIASES_KEY, JSON.stringify(usernameLoginAliases));
  } catch {
    // The authenticated mapping remains available for this session.
  }
}

function rememberUsernameLogin(user) {
  if (!user?.uid || !user.email) return;
  const usernameKey = normalizeLoginUsername(getUserDisplayName(user));
  if (!usernameKey || usernameKey.includes("@")) return;
  // Only a successfully authenticated Firebase user establishes this mapping.
  usernameLoginAliases = readUsernameLoginAliases().filter((item) => item.uid !== user.uid && item.usernameKey !== usernameKey);
  usernameLoginAliases.push({ usernameKey, uid: user.uid, email: String(user.email).trim().toLowerCase() });
  usernameLoginAliases = usernameLoginAliases.slice(-30);
  persistUsernameLoginAliases();
}

function forgetUsernameLogin(userId) {
  usernameLoginAliases = readUsernameLoginAliases().filter((item) => item.uid !== userId);
  persistUsernameLoginAliases();
}

function emailToUsername(email) {

  const value = String(email || "");

  const suffix = `@${USERNAME_EMAIL_DOMAIN}`;

  return value.endsWith(suffix) ? value.slice(0, -suffix.length) : value;
}

function getUserDisplayName(user = currentUser) {
  if (!user) {
    setBudgetValuesStatus("ready");
    return "";
  }

  return (user.displayName || emailToUsername(user.email) || "").trim();
}

async function handleAuthStateChanged(user) {
  const stateChangeSequence = ++authStateChangeSequence;
  const isCurrentStateChange = () => stateChangeSequence === authStateChangeSequence;
  authProfileHydrationPending = false;

  if (userProfileCloudSyncTimer) {
    window.clearTimeout(userProfileCloudSyncTimer);
    userProfileCloudSyncTimer = null;
  }

  if (cloudUnsubscribe) {
    cloudUnsubscribe();
    cloudUnsubscribe = null;
  }

  if (profileUnsubscribe) {
    profileUnsubscribe();
    profileUnsubscribe = null;
  }

  if (!user) {
    currentUser = null;
    deletedTransactionIds = loadDeletedTransactionIds();
    deletedTransactionSignatures = loadDeletedTransactionSignatures();
    deletedTransferTombstones = loadDeletedTransferTombstones();
    deletedAssetTombstones = loadDeletedAssetTombstones();
    deletedBesTombstones = loadDeletedBesTombstones();
    silinenBorcAlacakIzleri = silinenBorcAlacakIzleriniYukle();
    refreshCardReminderSettingsForCurrentUser();
    transactions = loadTransactions();
    assets = loadAssets();
    besAccounts = loadBesAccounts();
    borcAlacakKayitlari = borcAlacakKayitlariniYukle();
    paymentAccounts = loadPaymentAccounts();
    transactionCategories = loadTransactionCategories();
    syncCategorySelects();
    renderAuthState();
    render();
    cloudStatus.textContent = firebaseDb
      ? "Çıkış yapıldı. Bu cihazdaki yerel kayıtları görüyorsun."
      : cloudStatus.textContent;
    return;
  }

  const anonymousLocalTransactions = getCloudReadyTransactions(transactions);

  const anonymousLocalAssets = getCloudReadyAssets(assets);

  const anonymousLocalBesAccounts = getCloudReadyBesAccounts(besAccounts);
  const anonymousLocalDebtRecords = bulutaHazirBorcAlacakKayitlari(borcAlacakKayitlari);

  const anonymousLocalPaymentAccounts = getCloudReadyPaymentAccounts(paymentAccounts);

  const anonymousLocalCategories = normalizeCategoryState(transactionCategories);

  const anonymousDeletedTransactionState = getDeletedTransactionStateSnapshot();

  const anonymousDeletedProfileRecordState = getDeletedProfileRecordStateSnapshot();

  const anonymousLocalTransactionsUpdatedAt = loadTransactionsStateUpdatedAt();
  currentUser = user;
  authProfileHydrationPending = true;
  setBudgetValuesStatus("loading");
  rememberUsernameLogin(user);
  deletedTransactionIds = loadDeletedTransactionIds();
  deletedTransactionSignatures = loadDeletedTransactionSignatures();
  deletedTransferTombstones = loadDeletedTransferTombstones();
  deletedAssetTombstones = loadDeletedAssetTombstones();
  deletedBesTombstones = loadDeletedBesTombstones();
  silinenBorcAlacakIzleri = silinenBorcAlacakIzleriniYukle();
  applyDeletedTransactionState(anonymousDeletedTransactionState, getDeletedTransactionStateSnapshot());
  applyDeletedProfileRecordState(anonymousDeletedProfileRecordState, getDeletedProfileRecordStateSnapshot());
  refreshCardReminderSettingsForCurrentUser();

  const userLocalTransactions = getCloudReadyTransactions(loadTransactions());

  const userLocalTransactionsUpdatedAt = loadTransactionsStateUpdatedAt();

  const userLocalAssets = getCloudReadyAssets(loadAssets());

  const userLocalBesAccounts = getCloudReadyBesAccounts(loadBesAccounts());
  const userLocalDebtRecords = bulutaHazirBorcAlacakKayitlari(borcAlacakKayitlariniYukle());

  const userLocalPaymentAccounts = getCloudReadyPaymentAccounts(loadPaymentAccounts());

  const userLocalCategories = loadTransactionCategories();
  transactions = mergeTransactions(userLocalTransactions, anonymousLocalTransactions);
  assets = applyDeletedProfileTombstones(
    mergeVersionedRecordsById(userLocalAssets, anonymousLocalAssets),
    deletedAssetTombstones
  );
  besAccounts = applyDeletedProfileTombstones(
    mergeVersionedRecordsById(userLocalBesAccounts, anonymousLocalBesAccounts),
    deletedBesTombstones
  );
  borcAlacakKayitlari = applyDeletedProfileTombstones(
    mergeVersionedRecordsById(userLocalDebtRecords, anonymousLocalDebtRecords),
    silinenBorcAlacakIzleri
  );
  paymentAccounts = mergeRecordsById(userLocalPaymentAccounts, anonymousLocalPaymentAccounts);
  transactionCategories = mergeCategoryStates(
    userLocalCategories,
    anonymousLocalCategories,
    getTransactionCategoriesFromRecords(transactions)
  );
  persistTransactionCategories({ syncCloud: false });
  syncCategorySelects();
  renderAuthState();
  render();
  setBudgetValuesStatus("ready");
  cloudStatus.textContent = "Yerel kayıtlar hazır; canlı veriler getiriliyor...";

  try {
    subscribeCloudTransactions(user.uid);
    const cloudProfilePromise = fetchCloudProfile(user.uid, { source: "server" })
      .catch(() => fetchCloudProfile(user.uid));
    const cloudTransactionsPromise = fetchCloudTransactions(user.uid, { source: "server" })
      .catch(() => fetchCloudTransactions(user.uid).catch(() => []));
    const [cloudProfile, cloudCollectionTransactions] = await Promise.all([
      cloudProfilePromise,
      cloudTransactionsPromise,
    ]);
    if (!isCurrentStateChange() || currentUser?.uid !== user.uid) return;

    updateCloudBackupStatus(cloudProfile);
    applyCloudProfileContactInfo(cloudProfile);
    applyDeletedTransactionState(readCloudDeletedTransactionState(cloudProfile), anonymousDeletedTransactionState);
    applyDeletedProfileRecordState(
      readCloudDeletedProfileRecordState(cloudProfile),
      anonymousDeletedProfileRecordState
    );

    const cloudProfileTransactions = readCloudTransactionBackupArray(cloudProfile.transactionsBackup);

    const cloudTransactions = mergeTransactions(cloudProfileTransactions, cloudCollectionTransactions);

    const localTransactions = mergeTransactions(userLocalTransactions, anonymousLocalTransactions, transactions);

    const localTransactionsUpdatedAt = Math.max(
      userLocalTransactionsUpdatedAt,
      anonymousLocalTransactionsUpdatedAt,
      getTransactionsNewestMutationTimestamp(localTransactions)
    );

    const cloudTransactionsUpdatedAt =
      getRecordTimestamp(cloudProfile?.transactionsStateUpdatedAt) ||
      getRecordTimestamp(cloudProfile?.transactionsBackupUpdatedAt) ||
      getTransactionsNewestMutationTimestamp(cloudTransactions);

    transactions = mergeTransactions(cloudTransactions, localTransactions);
    assets = applyDeletedProfileTombstones(
      mergeVersionedRecordsById(readCloudAssets(cloudProfile.assets), userLocalAssets, anonymousLocalAssets, assets),
      deletedAssetTombstones
    );
    besAccounts = applyDeletedProfileTombstones(
      mergeVersionedRecordsById(
        readCloudBesAccounts(cloudProfile.besAccounts),
        userLocalBesAccounts,
        anonymousLocalBesAccounts,
        besAccounts
      ),
      deletedBesTombstones
    );
    borcAlacakKayitlari = applyDeletedProfileTombstones(
      mergeVersionedRecordsById(
        buluttanBorcAlacakKayitlariniOku(cloudProfile.debtReceivables),
        userLocalDebtRecords,
        anonymousLocalDebtRecords,
        borcAlacakKayitlari
      ),
      silinenBorcAlacakIzleri
    );
    paymentAccounts = mergeRecordsById(
      readCloudPaymentAccounts(cloudProfile.paymentAccounts),
      userLocalPaymentAccounts,
      anonymousLocalPaymentAccounts,
      paymentAccounts
    );
    transactionCategories = mergeCategoryStates(
      readCloudTransactionCategories(cloudProfile.transactionCategories),
      userLocalCategories,
      anonymousLocalCategories,
      transactionCategories,
      getTransactionCategoriesFromRecords(transactions)
    );

    const pendingLocalTransactionUpserts = getPendingLocalTransactionUpserts(localTransactions, cloudTransactions);

    const pendingLocalTransactionDeletes = getPendingLocalTransactionDeletes(cloudTransactions);

    const hasStaleLocalSyncFlag = loadTransactionsCloudDirtyAt() > 0 || isTransactionsCloudFullSyncRequired();

    const hasPendingLocalTransactionSync =
      pendingLocalTransactionUpserts.length > 0 ||
      pendingLocalTransactionDeletes.length > 0;

    refreshAllPaymentAccountsFromRecords({ silent: true, syncCloud: false });
    persistTransactions({ syncCloud: false });
    persistAssets({ syncCloud: false });
    persistBesAccounts({ syncCloud: false });
    borcAlacakKayitlariniKaliciKaydet({ syncCloud: false });
    persistPaymentAccounts({ syncCloud: false });
    persistTransactionCategories({ syncCloud: false });
    syncCategorySelects();
    render();
    authProfileHydrationPending = false;
    if (currentUser?.uid === user.uid) setBudgetValuesStatus("ready");

    const syncTasks = [syncUserProfileToCloud()];
    if (hasPendingLocalTransactionSync) {
      syncTasks.unshift(syncTransactionsToCloud({
        replace: false,
        upserts: pendingLocalTransactionUpserts,
        deletes: pendingLocalTransactionDeletes,
      }));
    } else if (hasStaleLocalSyncFlag) {
      clearTransactionsCloudFullSyncRequired();
      clearTransactionsCloudDirty();
    }
    bindPendingCloudSyncEvents();

    const syncResults = await Promise.allSettled(syncTasks);
    if (!isCurrentStateChange() || currentUser?.uid !== user.uid) return;

    const failedSync = syncResults.find((result) => result.status === "rejected");
    subscribeCloudProfile(user.uid);
    retryPendingTransactionsCloudSync();
    if (failedSync) {
      cloudStatus.textContent = `Bulut eşitleme tamamlanamadı: ${failedSync.reason?.message || "Bilinmeyen hata"}`;
    } else if (hasPendingLocalTransactionSync) {
      cloudStatus.textContent = `${transactions.length} kayıt Firebase ile eşitlendi.`;
    } else {
      cloudStatus.textContent = `${transactions.length} kayıt Firebase'den yüklendi.`;
    }
    return;
    cloudStatus.textContent = `${transactions.length} kayıt Firebase profil yedeğiyle eşitlendi.`;
  } catch (error) {
    if (!isCurrentStateChange() || currentUser?.uid !== user.uid) return;

    authProfileHydrationPending = false;
    cloudStatus.textContent = `Bulut kayıtları yüklenemedi: ${error.message}`;
    if (currentUser?.uid === user.uid) setBudgetValuesStatus(transactions.length || assets.length || besAccounts.length || paymentAccounts.length ? "ready" : "error");
  }
}

function setLoggedOutVisualState() {
  document.documentElement.classList.add("auth-logged-out");
  document.body.classList.add("auth-logged-out");

  if (appShell) {
    appShell.hidden = true;
    appShell.setAttribute("aria-hidden", "true");
    appShell.classList.remove("menu-open");
  }

  if (sidebar) {
    sidebar.classList.remove("open");
  }

  if (loginScreen) {
    loginScreen.hidden = !startupSplashFinished;
    loginScreen.setAttribute("aria-hidden", loginScreen.hidden ? "true" : "false");
  }

  document.querySelectorAll(".modal-backdrop").forEach((modal) => {
    modal.hidden = true;
  });

  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

function setLoggedInVisualState() {
  document.documentElement.classList.remove("auth-logged-out");
  document.body.classList.remove("auth-logged-out");

  if (loginScreen) {
    loginScreen.hidden = true;
    loginScreen.setAttribute("aria-hidden", "true");
  }

  if (appShell) {
    appShell.hidden = !startupSplashFinished;
    appShell.setAttribute("aria-hidden", appShell.hidden ? "true" : "false");
  }
}

function renderAuthState() {

  const signedIn = Boolean(currentUser);

  const hasOpenAuthSubPanel =
    !signedIn && ((signupForm && !signupForm.hidden) || (resetPasswordForm && !resetPasswordForm.hidden));

  if (signedIn) {
    setLoggedInVisualState();
  } else {
    setLoggedOutVisualState();
  }

  if (!hasOpenAuthSubPanel) {
    showAuthPanel("login");
  }
  if (logoutButton) {
    logoutButton.hidden = !signedIn;
  }
  if (footerLogoutButton) {
    footerLogoutButton.hidden = !signedIn;
  }
  authUserBadge.textContent = signedIn ? getUserDisplayName(currentUser) || "Giriş yapıldı" : "Giriş yapılmadı";
  setMobileSidebarOpen(false);

  if (signedIn) {
    saveLastUsername(getUserDisplayName(currentUser));
    authPassword.value = "";
    fillProfileForm();
    bindPendingCloudSyncEvents();
    window.setTimeout(() => retryPendingTransactionsCloudSync(), 1200);
  } else {
    authEmail.value = loadLastUsername();
    authPassword.value = "";
    activeView = "homeView";
    updateCloudBackupStatus();
  }
}

function fetchCloudProfile(userId, options = {}) {
  const getOptions = options.source ? { source: options.source } : undefined;
  return firebaseDb
    .collection("users")
    .doc(userId)
    .get(getOptions)
    .then((doc) => (doc.exists ? doc.data() || {} : {}));
}

function applyCloudAssetAndBesProfile(data = {}, options = {}) {
  const { renderAfterApply = true } = options;
  applyDeletedProfileRecordState(readCloudDeletedProfileRecordState(data));

  applyCloudProfileContactInfo(data);

  if (Array.isArray(data.assets) || Array.isArray(data.deletedAssetTombstones)) {
    assets = applyDeletedProfileTombstones(
      mergeVersionedRecordsById(readCloudAssets(data.assets), assets),
      deletedAssetTombstones
    );
    persistAssets({ syncCloud: false });
  }

  if (Array.isArray(data.besAccounts) || Array.isArray(data.deletedBesTombstones)) {
    besAccounts = applyDeletedProfileTombstones(
      mergeVersionedRecordsById(readCloudBesAccounts(data.besAccounts), besAccounts),
      deletedBesTombstones
    );
    persistBesAccounts({ syncCloud: false });
  }

  if (Array.isArray(data.debtReceivables) || Array.isArray(data.deletedDebtReceivableTombstones)) {
    borcAlacakKayitlari = applyDeletedProfileTombstones(
      mergeVersionedRecordsById(
        buluttanBorcAlacakKayitlariniOku(data.debtReceivables),
        borcAlacakKayitlari
      ),
      silinenBorcAlacakIzleri
    );
    borcAlacakKayitlariniKaliciKaydet({ syncCloud: false });
  }

  if (renderAfterApply) {
    renderAssets();
    renderBesAccounts();
    borcAlacaklariEkranaBas();
    renderHome();
  }
}

function refreshUserProfileFromServer(options = {}) {
  const { force = false } = options;

  if (!currentUser || !firebaseDb || !navigator.onLine) {
    return Promise.resolve(false);
  }

  if (cloudProfileRefreshPromise) {
    return cloudProfileRefreshPromise;
  }

  const now = Date.now();
  if (!force && now - lastCloudProfileRefreshAt < 750) {
    return Promise.resolve(false);
  }

  const userId = currentUser.uid;
  lastCloudProfileRefreshAt = now;
  cloudProfileRefreshPromise = fetchCloudProfile(userId, { source: "server" })
    .then((data) => {
      if (!currentUser || currentUser.uid !== userId) {
        return false;
      }

      applyCloudAssetAndBesProfile(data);
      updateCloudBackupStatus(data);
      return true;
    })
    .catch(() => false)
    .finally(() => {
      cloudProfileRefreshPromise = null;
    });

  return cloudProfileRefreshPromise;
}

function subscribeCloudProfile(userId) {
  profileUnsubscribe = firebaseDb
    .collection("users")
    .doc(userId)
    .onSnapshot(
      { includeMetadataChanges: true },
      (doc) => {

        const data = doc.data() || {};
        updateCloudBackupStatus(data);
        applyCloudAssetAndBesProfile(data, { renderAfterApply: false });

        if (Array.isArray(data.paymentAccounts)) {
          paymentAccounts = readCloudPaymentAccounts(data.paymentAccounts);
          persistPaymentAccounts({ syncCloud: false });
        }

        if (hasCategoryState(data.transactionCategories)) {
          transactionCategories = mergeCategoryStates(
            data.transactionCategories,
            transactionCategories,
            getTransactionCategoriesFromRecords(transactions)
          );
          persistTransactionCategories({ syncCloud: false });
          syncCategorySelects();
        }

        if (applyDeletedTransactionState(readCloudDeletedTransactionState(data))) {
          transactions = mergeTransactions(transactions);
          persistTransactions({ syncCloud: false });
        }

        if (Array.isArray(data.transactionsBackup)) {

          const profileTransactions = readCloudTransactionBackupArray(data.transactionsBackup);
          if (profileTransactions.length) {
            transactions = mergeTransactions(transactions, profileTransactions);
            persistTransactions({ syncCloud: false });
            transactionCategories = mergeCategoryStates(transactionCategories, getTransactionCategoriesFromRecords(transactions));
            persistTransactionCategories({ syncCloud: false });
            syncCategorySelects();
          }
        }

        refreshAllPaymentAccountsFromRecords({ silent: true, syncCloud: true });
        renderAssets();
        renderPaymentAccounts();
        renderBesAccounts();
        borcAlacaklariEkranaBas();
        renderHome();
      },
      (error) => {
        cloudStatus.textContent = `Profil dinleme hatası: ${error.message}`;
      }
    );
}

function fetchCloudTransactions(userId, options = {}) {

  const getOptions = options.source ? { source: options.source } : undefined;
  return getUserTransactionsCollection(userId)
    .get(getOptions)
    .then((snapshot) => snapshot.docs.map(readCloudTransaction).filter(Boolean).filter((item) => !isTransactionDeleted(item)));
}

function subscribeCloudTransactions(userId) {
  cloudUnsubscribe = getUserTransactionsCollection(userId).onSnapshot(
    { includeMetadataChanges: true },
    (snapshot) => {

      const cloudTransactions = snapshot.docs
        .map(readCloudTransaction)
        .filter(Boolean)
        .filter((item) => !isTransactionDeleted(item));

      if (snapshot.metadata?.hasPendingWrites || cloudTransactionsSyncInFlight) {
        cloudStatus.textContent = `${transactions.length} kayıt buluta yazılıyor...`;
        return;
      }

      const localUpdatedAt = Math.max(
        loadTransactionsStateUpdatedAt(),
        getTransactionsNewestMutationTimestamp(transactions)
      );

      const cloudProfileUpdatedAt = 0;

      const cloudUpdatedAt = getTransactionsNewestMutationTimestamp(cloudTransactions);

      if (transactions.length && localUpdatedAt > cloudUpdatedAt && snapshot.metadata?.fromCache) {
        cloudStatus.textContent = `${transactions.length} kayıt yerelde daha güncel; Firebase yazımı bekleniyor.`;
        markTransactionsCloudDirty();
        schedulePendingTransactionsCloudSync();
        return;
      }

      transactions = mergeTransactions(transactions, cloudTransactions);
      transactionCategories = mergeCategoryStates(transactionCategories, getTransactionCategoriesFromRecords(transactions));
      persistTransactionCategories({ syncCloud: false });
      syncCategorySelects();
      persistTransactions({ syncCloud: false });
      refreshAllPaymentAccountsFromRecords({ silent: true, syncCloud: !authProfileHydrationPending });
      render();

      const sourceLabel = snapshot.metadata?.fromCache ? "yerel önbellekten" : "buluttan";
      cloudStatus.textContent = `${transactions.length} kayıt ${sourceLabel} güncel.`;
    },
    (error) => {
      cloudStatus.textContent = `Bulut dinleme hatası: ${error.message}`;
    }
  );
}

function getCloudWriteBatchLimit() {
  // Firestore batch limiti 500'dür. Profil güncellemesi ve güvenli pay için 450 kullanıyoruz.
  return 450;
}

async function commitCloudOperationsInChunks(operations = []) {

  const limit = getCloudWriteBatchLimit();

  for (let index = 0; index < operations.length; index += limit) {

    const batch = firebaseDb.batch();

    const chunk = operations.slice(index, index + limit);

    chunk.forEach((operation) => {
      if (operation.type === "delete") {
        batch.delete(operation.ref);
        return;
      }

      batch.set(operation.ref, operation.data, operation.options || { merge: true });
    });

    await batch.commit();
  }
}

function getJsonByteSize(value) {
  try {
    return new Blob([JSON.stringify(value) || ""]).size;
  } catch {
    return Number.POSITIVE_INFINITY;
  }
}

function createProfileTransactionBackupFields(safeTransactions = [], transactionsStateUpdatedAt = Date.now()) {

  const backup = safeTransactions.map(toCloudTransactionBackup);

  const fullBackupFields = {
    transactionsBackup: backup,
    transactionsBackupUpdatedAt: transactionsStateUpdatedAt,
    transactionsBackupMode: "full",
    transactionsBackupCount: backup.length,
  };

  if (getJsonByteSize(fullBackupFields) <= MAX_PROFILE_TRANSACTIONS_BACKUP_BYTES) {
    return fullBackupFields;
  }

  return {
    transactionsBackup: window.firebase.firestore.FieldValue.delete(),
    transactionsBackupUpdatedAt: transactionsStateUpdatedAt,
    transactionsBackupMode: "collection_only",
    transactionsBackupCount: backup.length,
    transactionsBackupSkippedAt: transactionsStateUpdatedAt,
  };
}

function syncTransactionsToCloud(options = {}) {
  const { replace = false, upserts = null, deletes = null } = options;

  if (!currentUser || !firebaseDb) {
    return Promise.resolve();
  }

  const user = currentUser;

  let safeTransactions = getCloudReadyTransactions(transactions).filter((item) => !isTransactionDeleted(item));

  let deltaUpserts = Array.isArray(upserts)
    ? getCloudReadyTransactions(upserts).filter((item) => !isTransactionDeleted(item))
    : null;

  let deltaDeletes = Array.isArray(deletes)
    ? deletes.map((id) => String(id || "")).filter(Boolean)
    : null;

  const hasDeltaOperations = !replace && (deltaUpserts !== null || deltaDeletes !== null);

  const deletedPayload = getCloudDeletedTransactionPayload();

  const transactionsStateUpdatedAt = saveTransactionsStateUpdatedAt();

  const syncVersion = ++cloudTransactionsSyncVersion;

  const isLatestSync = () => syncVersion === cloudTransactionsSyncVersion;

  const shouldAbortStaleFullSync = () => !hasDeltaOperations && !isLatestSync();
  cloudTransactionsSyncInFlight = true;

  const writeTransactions = async () => {
    try {
    if (shouldAbortStaleFullSync()) {
      return;
    }

    const collection = getUserTransactionsCollection(user.uid);

    if (!replace && !hasDeltaOperations) {

      const latestCloudTransactions = await withTimeout(
        fetchCloudTransactions(user.uid).catch(() => []),
        CLOUD_WRITE_TIMEOUT_MS,
        "Firebase kayıtları okunurken zaman aşımı oluştu."
      );

      if (shouldAbortStaleFullSync()) {
        return;
      }

      transactions = mergeTransactions(latestCloudTransactions, transactions);
      localStorage.setItem(getStorageKey(), JSON.stringify(transactions));
      safeTransactions = getCloudReadyTransactions(transactions).filter((item) => !isTransactionDeleted(item));
    }

    if (hasDeltaOperations && deltaUpserts !== null) {
      deltaUpserts = getCloudReadyTransactions(deltaUpserts).filter((item) => !isTransactionDeleted(item));
    }

    const profileBackupFields = createProfileTransactionBackupFields(safeTransactions, transactionsStateUpdatedAt);

    const profileBackupPayload = {
      email: user.email || "",
      username: getUserDisplayName(user),
      ...profileBackupFields,
      ...deletedPayload,
      transactionsStateUpdatedAt,
      updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
    };

    const operations = [];

    const deletedIds = new Set(
      hasDeltaOperations
        ? deltaDeletes || []
        : [
            ...Array.from(deletedTransactionIds || []),
            ...(deletedPayload.deletedTransactionIds || []),
          ]
    );

    deletedIds.forEach((id) => {
      if (id) {
        operations.push({ type: "delete", ref: collection.doc(String(id)) });
      }
    });

    if (replace) {

      const snapshot = await withTimeout(
        collection.get(),
        CLOUD_WRITE_TIMEOUT_MS,
        "Firebase kayıt listesi alınırken zaman aşımı oluştu."
      );

      if (shouldAbortStaleFullSync()) {
        return;
      }

      const currentIds = new Set(safeTransactions.map((item) => item.id));
      snapshot.docs.forEach((doc) => {
        if (!currentIds.has(doc.id)) {
          operations.push({ type: "delete", ref: doc.ref });
        }
      });
    }

    const transactionsToWrite = hasDeltaOperations ? deltaUpserts || [] : safeTransactions;
    transactionsToWrite.forEach((transaction) => {
      operations.push({
        type: "set",
        ref: collection.doc(transaction.id),
        data: toCloudTransaction(transaction),
        // Düzenlenen kayıtta eski type/category/payment alanları kalmasın diye dokümanı birebir güncelliyoruz.
        options: { merge: false },
      });
    });

    cloudStatus.textContent = "Buluta kaydediliyor...";
    try {
      await withTimeout(
        commitCloudOperationsInChunks(operations),
        CLOUD_WRITE_TIMEOUT_MS,
        "Firebase transactions yazımı zaman aşımına uğradı."
      );
    } catch (error) {
      if (isLatestSync() || hasDeltaOperations) {
        markTransactionsCloudFullSyncRequired();
        markTransactionsCloudDirty();
        schedulePendingTransactionsCloudSync();
      }
      if (isLatestSync()) {

        const rulesHint = error?.code === "permission-denied"
          ? " Firebase Console'da firestore.rules dosyasını yayınla."
          : "";
        cloudStatus.textContent =
          `${safeTransactions.length} kayıt Firebase transactions alt koleksiyonuna yazılamadı: ${error.message}.${rulesHint}`;
      }
      return;
    } finally {
      if (isLatestSync()) {
        cloudTransactionsSyncInFlight = false;
      }
    }

    let profileWarning = "";
    try {
      await withTimeout(
        firebaseDb.collection("users").doc(user.uid).set(profileBackupPayload, { merge: true }),
        CLOUD_WRITE_TIMEOUT_MS,
        "Firebase profil yedeği güncellenirken zaman aşımı oluştu."
      );
    } catch (error) {
      profileWarning = ` Profil yedeği güncellenemedi: ${error.message}`;
    }

    if (isLatestSync()) {
      if (hasDeltaOperations && isTransactionsCloudFullSyncRequired()) {
        markTransactionsCloudDirty();
        schedulePendingTransactionsCloudSync();
      } else {
        clearTransactionsCloudFullSyncRequired();
        clearTransactionsCloudDirty(transactionsStateUpdatedAt);
      }

      const backupNote = profileBackupFields.transactionsBackupMode === "collection_only"
        ? " Profil yedeği büyüdüğü için kayıtların ana kaynağı transactions alt koleksiyonu."
        : "";

      const savedCountText = hasDeltaOperations
        ? `${transactionsToWrite.length + deletedIds.size} değişiklik`
        : `${safeTransactions.length} kayıt`;
      cloudStatus.textContent = `${savedCountText} Firebase transactions koleksiyonuna kaydedildi.${backupNote}${profileWarning}`;
    }
    } finally {
      if (isLatestSync()) {
        cloudTransactionsSyncInFlight = false;
      }
    }
  };

  const runSync = () =>
    writeTransactions().catch((error) => {
      if (isLatestSync()) {
        cloudTransactionsSyncInFlight = false;
      }
      if (isLatestSync() || hasDeltaOperations) {
        markTransactionsCloudFullSyncRequired();
        markTransactionsCloudDirty();
        schedulePendingTransactionsCloudSync();
      }
      if (isLatestSync()) {

        const message = error?.code === "permission-denied"
          ? "Firebase kuralları eski görünüyor. firestore.rules dosyasını Firebase Console'da yayınla."
          : `Firebase'e kaydedilemedi: ${error.message}`;
        cloudStatus.textContent = message;
      }
      throw error;
    });

  cloudWriteQueue = cloudWriteQueue.catch(() => {}).then(runSync);
  return cloudWriteQueue;
}

let pendingTransactionsCloudSyncTimer = null;

function schedulePendingTransactionsCloudSync(delay = 3500) {
  if (pendingTransactionsCloudSyncTimer) {
    window.clearTimeout(pendingTransactionsCloudSyncTimer);
  }

  pendingTransactionsCloudSyncTimer = window.setTimeout(() => {
    pendingTransactionsCloudSyncTimer = null;
    retryPendingTransactionsCloudSync();
  }, delay);
}

function retryPendingTransactionsCloudSync() {
  if (!currentUser || !firebaseDb || cloudTransactionsSyncInFlight || !loadTransactionsCloudDirtyAt()) {
    return Promise.resolve(false);
  }

  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    cloudStatus.textContent = "İnternet bağlantısı bekleniyor; yerel kayıtlar Firebase'e gönderilecek.";
    schedulePendingTransactionsCloudSync(7000);
    return Promise.resolve(false);
  }

  cloudStatus.textContent = "Yerelde kalan kayıtlar Firebase'e gönderiliyor...";
  return fetchCloudTransactions(currentUser.uid, { source: "server" })
    .catch(() => fetchCloudTransactions(currentUser.uid).catch(() => []))
    .then((cloudTransactions) => {

      const pendingUpserts = getPendingLocalTransactionUpserts(transactions, cloudTransactions);

      const pendingDeletes = getPendingLocalTransactionDeletes(cloudTransactions);

      if (!pendingUpserts.length && !pendingDeletes.length) {
        clearTransactionsCloudFullSyncRequired();
        clearTransactionsCloudDirty();
        cloudStatus.textContent = `${transactions.length} kayıt Firebase ile güncel.`;
        return true;
      }

      return syncTransactionsToCloud({
        replace: false,
        upserts: pendingUpserts,
        deletes: pendingDeletes,
      }).then(() => true);
    })
    .catch(() => false);
}

function bindPendingCloudSyncEvents() {
  if (window.__akisBudgetPendingCloudSyncBound) {
    return;
  }

  window.__akisBudgetPendingCloudSyncBound = true;

  let resumeRefreshPromise = null;
  const refreshAfterResume = () => {
    if (resumeRefreshPromise) {
      return resumeRefreshPromise;
    }

    resumeRefreshPromise = refreshUserProfileFromServer({ force: true })
      .then(() => Promise.allSettled([
        retryPendingTransactionsCloudSync(),
        retryPendingUserProfileCloudSync(),
      ]))
      .finally(() => {
        resumeRefreshPromise = null;
      });

    return resumeRefreshPromise;
  };

  window.addEventListener("online", refreshAfterResume);
  window.addEventListener("focus", refreshAfterResume);
  window.addEventListener("pageshow", refreshAfterResume);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      refreshAfterResume();
    }
  });
}

function markUserProfileCloudDirty() {
  if (currentUser) {
    localStorage.setItem(getStorageKey(PROFILE_CLOUD_DIRTY_STORAGE_KEY), String(Date.now()));
  }
}

function clearUserProfileCloudDirty() {
  if (currentUser) {
    localStorage.removeItem(getStorageKey(PROFILE_CLOUD_DIRTY_STORAGE_KEY));
  }
}

function retryPendingUserProfileCloudSync() {
  if (!currentUser || !firebaseDb || !navigator.onLine) {
    return Promise.resolve();
  }

  const dirtyAt = Number(localStorage.getItem(getStorageKey(PROFILE_CLOUD_DIRTY_STORAGE_KEY)) || 0);
  return dirtyAt > 0 ? syncUserProfileToCloud() : Promise.resolve();
}

function scheduleUserProfileCloudSync(delay = 180) {
  if (!currentUser || !firebaseDb) return;

  markUserProfileCloudDirty();
  if (userProfileCloudSyncTimer) window.clearTimeout(userProfileCloudSyncTimer);
  userProfileCloudSyncTimer = window.setTimeout(() => {
    userProfileCloudSyncTimer = null;
    syncUserProfileToCloud();
  }, delay);
}

function syncUserProfileToCloud() {
  if (!currentUser || !firebaseDb) {
    return Promise.resolve();
  }

  if (userProfileCloudSyncTimer) {
    window.clearTimeout(userProfileCloudSyncTimer);
    userProfileCloudSyncTimer = null;
  }

  const user = currentUser;
  markUserProfileCloudDirty();
  const contactSnapshot = loadProfileContactInfo();
  let committedContact = contactSnapshot;

  const syncVersion = ++cloudProfileSyncVersion;

  const safeAssets = getCloudReadyAssets(assets);

  const safeBesAccounts = getCloudReadyBesAccounts(besAccounts);
  const safeDebtRecords = bulutaHazirBorcAlacakKayitlari(borcAlacakKayitlari);

  const safePaymentAccounts = getCloudReadyPaymentAccounts(paymentAccounts);

  const safeTransactionCategories = normalizeCategoryState(transactionCategories);

  const deletedPayload = getCloudDeletedTransactionPayload();
  const localDeletedProfileState = getDeletedProfileRecordStateSnapshot();
  const userRef = firebaseDb.collection("users").doc(user.uid);
  let committedAssets = safeAssets;
  let committedBesAccounts = safeBesAccounts;
  let committedDebtRecords = safeDebtRecords;
  let committedDeletedProfileState = localDeletedProfileState;

  const syncPromise = firebaseDb
    .runTransaction(async (transaction) => {
      const snapshot = await transaction.get(userRef);
      const remoteProfile = snapshot.exists ? snapshot.data() || {} : {};
      const remoteContact = readCloudProfileContactInfo(remoteProfile, contactSnapshot);
      committedContact = !contactSnapshot.pendingSync && remoteContact.updatedAt > contactSnapshot.updatedAt
        ? remoteContact : contactSnapshot;

      committedDeletedProfileState = mergeDeletedProfileRecordStates(
        readCloudDeletedProfileRecordState(remoteProfile),
        localDeletedProfileState
      );
      committedAssets = applyDeletedProfileTombstones(
        mergeVersionedRecordsById(readCloudAssets(remoteProfile.assets), safeAssets),
        committedDeletedProfileState.assetTombstones
      );
      committedBesAccounts = applyDeletedProfileTombstones(
        mergeVersionedRecordsById(readCloudBesAccounts(remoteProfile.besAccounts), safeBesAccounts),
        committedDeletedProfileState.besTombstones
      );
      committedDebtRecords = applyDeletedProfileTombstones(
        mergeVersionedRecordsById(
          buluttanBorcAlacakKayitlariniOku(remoteProfile.debtReceivables),
          safeDebtRecords
        ),
        committedDeletedProfileState.debtTombstones
      );

      transaction.set(
        userRef,
        {
          email: user.email || "",
          username: getUserDisplayName(user),
          homeAddress: committedContact.homeAddress,
          workAddress: committedContact.workAddress,
          profileContactUpdatedAt: committedContact.updatedAt,
          assets: committedAssets,
          besAccounts: committedBesAccounts,
          debtReceivables: committedDebtRecords,
          paymentAccounts: safePaymentAccounts,
          transactionCategories: safeTransactionCategories,
          ...deletedPayload,
          ...getCloudDeletedProfileRecordPayload(committedDeletedProfileState),
          updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    })
    .then(() => {
      if (currentUser?.uid === user.uid) {
        const latestContact = loadProfileContactInfo();
        if (latestContact.updatedAt === contactSnapshot.updatedAt &&
            latestContact.homeAddress === contactSnapshot.homeAddress &&
            latestContact.workAddress === contactSnapshot.workAddress) {
          saveProfileContactInfo(committedContact, { updatedAt: committedContact.updatedAt, pendingSync: false });
        }
      }
      applyDeletedProfileRecordState(committedDeletedProfileState);
      assets = applyDeletedProfileTombstones(
        mergeVersionedRecordsById(committedAssets, assets),
        deletedAssetTombstones
      );
      besAccounts = applyDeletedProfileTombstones(
        mergeVersionedRecordsById(committedBesAccounts, besAccounts),
        deletedBesTombstones
      );
      borcAlacakKayitlari = applyDeletedProfileTombstones(
        mergeVersionedRecordsById(committedDebtRecords, borcAlacakKayitlari),
        silinenBorcAlacakIzleri
      );
      persistAssets({ syncCloud: false });
      persistBesAccounts({ syncCloud: false });
      borcAlacakKayitlariniKaliciKaydet({ syncCloud: false });
      renderAssets();
      renderBesAccounts();
      borcAlacaklariEkranaBas();
      renderHome();
      if (syncVersion === cloudProfileSyncVersion) {
        if (!loadProfileContactInfo().pendingSync) clearUserProfileCloudDirty();
        cloudStatus.textContent = "Kart, hesap, varlık, BES, borç/alacak ve kategori bilgileri buluta kaydedildi.";
      }
    })
    .catch((error) => {
      if (syncVersion === cloudProfileSyncVersion) {
        cloudStatus.textContent = `Profil buluta kaydedilemedi: ${error.message}`;
      }
    });

  return syncPromise;
}

function getUserTransactionsCollection(userId) {
  return firebaseDb.collection("users").doc(userId).collection("transactions");
}

function toCloudTransaction(transaction) {

  const createdAt = ensureTransactionCreatedAt(transaction);
  return {
    id: transaction.id,
    type: transaction.type,
    title: transaction.title,
    amount: Number(transaction.amount),
    category: transaction.category,
    paymentMethod: normalizePaymentMethod(transaction.paymentMethod || "cash"),
    paymentAccountId: String(transaction.paymentAccountId || ""),
    transferAccountId: String(transaction.transferAccountId || ""),
    transferFee: Math.max(0, Number(transaction.transferFee || 0)),
    date: transaction.date,
    note: transaction.note || "",
    isInstallment: Boolean(transaction.isInstallment),
    installmentGroupId: String(transaction.installmentGroupId || ""),
    installmentNumber: Math.max(0, Math.min(60, Math.trunc(Number(transaction.installmentNumber || 0)))),
    installmentCount: Math.max(0, Math.min(60, Math.trunc(Number(transaction.installmentCount || 0)))),
    installmentCompleted: Boolean(transaction.installmentCompleted),
    installmentCompletedAt: String(transaction.installmentCompletedAt || ""),
    transactionAt: transaction.transactionAt || "",
    debtReceivableId: String(transaction.debtReceivableId || ""),
    debtPaymentId: String(transaction.debtPaymentId || ""),
    debtInstallmentId: String(transaction.debtInstallmentId || ""),
    debtAction: String(transaction.debtAction || ""),
    debtAppliedAmount: Math.max(0, Number(transaction.debtAppliedAmount || 0)),
    createdAt,
    updatedAt: transaction.updatedAt || window.firebase.firestore.FieldValue.serverTimestamp(),
  };
}

function toCloudTransactionBackup(transaction) {

  const createdAt = ensureTransactionCreatedAt(transaction);
  return {
    id: transaction.id,
    type: transaction.type,
    title: transaction.title,
    amount: Number(transaction.amount),
    category: transaction.category,
    paymentMethod: normalizePaymentMethod(transaction.paymentMethod || "cash"),
    paymentAccountId: String(transaction.paymentAccountId || ""),
    transferAccountId: String(transaction.transferAccountId || ""),
    transferFee: Math.max(0, Number(transaction.transferFee || 0)),
    date: transaction.date,
    note: transaction.note || "",
    isInstallment: Boolean(transaction.isInstallment),
    installmentGroupId: String(transaction.installmentGroupId || ""),
    installmentNumber: Math.max(0, Math.min(60, Math.trunc(Number(transaction.installmentNumber || 0)))),
    installmentCount: Math.max(0, Math.min(60, Math.trunc(Number(transaction.installmentCount || 0)))),
    installmentCompleted: Boolean(transaction.installmentCompleted),
    installmentCompletedAt: String(transaction.installmentCompletedAt || ""),
    transactionAt: transaction.transactionAt || "",
    debtReceivableId: String(transaction.debtReceivableId || ""),
    debtPaymentId: String(transaction.debtPaymentId || ""),
    debtInstallmentId: String(transaction.debtInstallmentId || ""),
    debtAction: String(transaction.debtAction || ""),
    debtAppliedAmount: Math.max(0, Number(transaction.debtAppliedAmount || 0)),
    createdAt,
    updatedAt: normalizeCloudTimestamp(transaction.updatedAt) || String(transaction.updatedAt || createdAt || getTurkeyNowDateTime()),
  };
}

function readCloudTransaction(doc) {

  const data = doc.data() || {};

  const updatedAt = normalizeCloudTimestamp(data.updatedAt);

  const createdAt =
    normalizeCloudTimestamp(data.createdAt) ||
    normalizeCloudTimestamp(data.addedAt) ||
    updatedAt ||
    String(data.createdAt || data.addedAt || "");

  const transaction = {
    id: doc.id,
    type: data.type,
    title: String(data.title || ""),
    amount: Number(data.amount),
    category: String(data.category || ""),
    paymentMethod: normalizePaymentMethod(data.paymentMethod || "cash"),
    paymentAccountId: String(data.paymentAccountId || ""),
    transferAccountId: String(data.transferAccountId || ""),
    transferFee: Math.max(0, Number(data.transferFee || 0)),
    date: String(data.date || ""),
    note: String(data.note || ""),
    isInstallment: Boolean(data.isInstallment),
    installmentGroupId: String(data.installmentGroupId || ""),
    installmentNumber: Math.max(0, Math.min(60, Math.trunc(Number(data.installmentNumber || 0)))),
    installmentCount: Math.max(0, Math.min(60, Math.trunc(Number(data.installmentCount || 0)))),
    installmentCompleted: Boolean(data.installmentCompleted),
    installmentCompletedAt: String(data.installmentCompletedAt || ""),
    transactionAt: String(data.transactionAt || ""),
    debtReceivableId: String(data.debtReceivableId || ""),
    debtPaymentId: String(data.debtPaymentId || ""),
    debtInstallmentId: String(data.debtInstallmentId || ""),
    debtAction: String(data.debtAction || ""),
    debtAppliedAmount: Math.max(0, Number(data.debtAppliedAmount || 0)),
    createdAt,
    updatedAt,
  };

  return isValidTransaction(transaction) ? transaction : null;
}

function readCloudTransactionBackupArray(source) {
  if (!Array.isArray(source)) {
    return [];
  }

  return source
    .map((item) =>
      readCloudTransaction({
        id: String(item?.id || ""),
        data: () => item || {},
      })
    )
    .filter(Boolean)
    .filter((item) => !isTransactionDeleted(item));
}

function getCloudReadyTransactions(source) {
  return source.filter((item) => isValidTransaction(item) && !isSampleTransaction(item) && !isTransactionDeleted(item));
}

function getCloudReadyAssets(source) {
  return applyDeletedProfileTombstones(readCloudAssets(source), deletedAssetTombstones);
}

function getCloudReadyBesAccounts(source) {
  return applyDeletedProfileTombstones(readCloudBesAccounts(source), deletedBesTombstones);
}

function getCloudReadyPaymentAccounts(source) {
  return readCloudPaymentAccounts(source);
}

function readCloudAssets(source) {
  return Array.isArray(source) ? source.map(normalizeAsset).filter(Boolean) : [];
}

function readCloudBesAccounts(source) {
  return Array.isArray(source) ? source.map(normalizeBesAccount).filter(Boolean) : [];
}

function readCloudPaymentAccounts(source) {
  return Array.isArray(source) ? source.map(normalizePaymentAccount).filter(Boolean) : [];
}

function normalizeAsset(item) {
  if (!item || typeof item.id !== "string" || !assetDefinitions[item.type]) {
    return null;
  }

  const amount = Number(item.amount);

  if (!Number.isFinite(amount) || amount < 0) {
    return null;
  }

  const definition = getAssetDefinition(item.type);
  return {
    id: item.id,
    type: item.type,
    label: String(item.label || definition.label),
    amount,
    createdAt: String(item.createdAt || ""),
    updatedAt: String(item.updatedAt || ""),
  };
}

function normalizeBesAccount(item) {
  if (!item || typeof item.id !== "string") {
    return null;
  }

  const provider = String(item.provider || "").trim();

  const contribution = Number(item.contribution || 0);

  const stateContribution = Number(item.stateContribution || 0);

  const stateGain = Number(item.stateGain || 0);

  const gain = Number(item.gain || 0);

  if (
    !provider ||
    !Number.isFinite(contribution) ||
    !Number.isFinite(stateContribution) ||
    !Number.isFinite(stateGain) ||
    !Number.isFinite(gain)
  ) {
    return null;
  }

  return {
    id: item.id,
    provider,
    policyNo: String(item.policyNo || ""),
    contribution,
    stateContribution,
    stateGain,
    gain,
    note: String(item.note || ""),
    createdAt: String(item.createdAt || ""),
    updatedAt: String(item.updatedAt || ""),
  };
}

function normalizePaymentAccount(item) {
  if (!item || typeof item.id !== "string") {
    return null;
  }

  const type = normalizePaymentAccountType(item.type);

  const name = String(item.name || "").trim();

  const balance = Number(item.balance || 0);

  const debt = Number(item.debt || 0);

  const currentStatementDebt = Number(item.currentStatementDebt ?? debt);

  const creditPaidTotal = Number(item.creditPaidTotal || 0);

  const currentStatementPaidTotal = Number(item.currentStatementPaidTotal || 0);

  const debtBaselineVersion = Number(item.debtBaselineVersion || 0);

  const limit = Number(item.limit || 0);

  const openingBalance = hasStoredMoneyValue(item.openingBalance) ? Number(item.openingBalance) : null;

  const openingDebt = hasStoredMoneyValue(item.openingDebt) ? Number(item.openingDebt) : null;

  const openingCurrentStatementDebt = hasStoredMoneyValue(item.openingCurrentStatementDebt)
    ? Number(item.openingCurrentStatementDebt)
    : null;

  if (
    !name ||
    !Number.isFinite(balance) ||
    !Number.isFinite(debt) ||
    !Number.isFinite(currentStatementDebt) ||
    !Number.isFinite(creditPaidTotal) ||
    !Number.isFinite(currentStatementPaidTotal) ||
    !Number.isFinite(limit)
  ) {
    return null;
  }

  return {
    id: item.id,
    type,
    name,
    bank: String(item.bank || ""),
    color: normalizePaymentCardColor(item.color, type),
    last4: String(item.last4 || "").replace(/\D/g, "").slice(-4),
    expiry: type === "credit_card" ? String(item.expiry || "") : "",
    statementDay: type === "credit_card" ? clampDay(item.statementDay) : 0,
    dueDay: type === "credit_card" ? clampDay(item.dueDay) : 0,
    limit: type === "credit_card" ? Math.max(0, roundMoney(limit)) : 0,
    debt: type === "credit_card" ? Math.max(0, roundMoney(debt)) : 0,
    currentStatementDebt: type === "credit_card"
      ? clampCreditCardStatementDebt(debt, currentStatementDebt)
      : 0,
    openingDebt: type === "credit_card" && openingDebt !== null ? roundMoney(openingDebt) : null,
    openingCurrentStatementDebt: type === "credit_card" && openingCurrentStatementDebt !== null ? roundMoney(openingCurrentStatementDebt) : null,
    creditPaidTotal: type === "credit_card" ? Math.max(0, roundMoney(creditPaidTotal)) : 0,
    currentStatementPaidTotal: type === "credit_card" ? Math.max(0, roundMoney(currentStatementPaidTotal)) : 0,
    debtBaselineVersion: type === "credit_card" && Number.isFinite(debtBaselineVersion)
      ? Math.max(0, Math.trunc(debtBaselineVersion))
      : 0,
    creditPaidPeriodKey: type === "credit_card" ? String(item.creditPaidPeriodKey || "") : "",
    balance: type !== "credit_card" ? roundMoney(balance) : 0,
    openingBalance: type !== "credit_card" && openingBalance !== null ? roundMoney(openingBalance) : null,
    note: String(item.note || ""),
    createdAt: String(item.createdAt || ""),
    updatedAt: String(item.updatedAt || ""),
  };
}

function mergeVersionedRecordsById(...sources) {
  const merged = new Map();

  sources
    .flat()
    .filter((item) => item && typeof item.id === "string")
    .forEach((item) => {
      const existing = merged.get(item.id);
      const itemTimestamp = getRecordTimestamp(item.updatedAt) || getRecordTimestamp(item.createdAt);
      const existingTimestamp = existing
        ? getRecordTimestamp(existing.updatedAt) || getRecordTimestamp(existing.createdAt)
        : 0;

      if (!existing || itemTimestamp > existingTimestamp) {
        merged.set(item.id, item);
      }
    });

  return Array.from(merged.values());
}

function mergeRecordsById(...sources) {

  const merged = new Map();

  sources
    .flat()
    .filter((item) => item && typeof item.id === "string")
    .forEach((item) => {
      merged.set(item.id, item);
    });

  return Array.from(merged.values());
}

function normalizeCloudTimestamp(value) {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }

  if (Number.isFinite(Number(value.seconds))) {
    return new Date(Number(value.seconds) * 1000).toISOString();
  }

  return "";
}

function ensureTransactionCreatedAt(item) {
  if (!item) {
    return getTurkeyNowDateTime();
  }

  return (
    normalizeCloudTimestamp(item.createdAt) ||
    normalizeCloudTimestamp(item.addedAt) ||
    normalizeCloudTimestamp(item.updatedAt) ||
    String(item.createdAt || item.addedAt || item.updatedAt || item.transactionAt || "") ||
    getTurkeyNowDateTime()
  );
}

function normalizeTransactionRecord(item) {
  if (!isValidTransaction(item)) {
    return null;
  }

  return {
    ...item,
    amount: Number(item.amount),
    transferFee: Math.max(0, Number(item.transferFee || 0)),
    paymentMethod: item.type === "transfer" ? "transfer" : normalizePaymentMethod(item.paymentMethod || "cash"),
    paymentAccountId: String(item.paymentAccountId || ""),
    transferAccountId: item.type === "transfer" ? String(item.transferAccountId || "") : "",
    note: String(item.note || ""),
    isInstallment: Boolean(item.isInstallment),
    installmentGroupId: String(item.installmentGroupId || ""),
    installmentNumber: Math.max(0, Math.min(60, Math.trunc(Number(item.installmentNumber || 0)))),
    installmentCount: Math.max(0, Math.min(60, Math.trunc(Number(item.installmentCount || 0)))),
    installmentCompleted: Boolean(item.installmentCompleted),
    installmentCompletedAt: String(item.installmentCompletedAt || ""),
    transactionAt: String(item.transactionAt || ""),
    createdAt: ensureTransactionCreatedAt(item),
    updatedAt: normalizeCloudTimestamp(item.updatedAt) || String(item.updatedAt || ""),
  };
}

function getTransactionMergeTimestamp(item) {
  return (
    getRecordTimestamp(item?.updatedAt) ||
    getRecordTimestamp(item?.createdAt) ||
    getTransactionSortTimestamp(item) ||
    0
  );
}

function shouldReplaceMergedTransaction(existing, next) {
  if (!existing) {
    return true;
  }

  if (existing.id === next.id) {
    if (next.type === "transfer" && existing.type !== "transfer") {
      return true;
    }

    if (existing.type === "transfer" && next.type !== "transfer" && isLegacySplitRowForTransfer(existing, next)) {
      return false;
    }
  }

  const existingTime = getTransactionMergeTimestamp(existing);

  const nextTime = getTransactionMergeTimestamp(next);

  if (nextTime !== existingTime) {
    return nextTime > existingTime;
  }

  return String(next.id || "") > String(existing.id || "");
}

function mergeTransactions(...sources) {

  const byId = new Map();

  sources
    .flat()
    .map(normalizeTransactionRecord)
    .filter(Boolean)
    .filter((item) => !isTransactionDeleted(item))
    .forEach((transaction) => {

      const existing = byId.get(transaction.id);
      if (shouldReplaceMergedTransaction(existing, transaction)) {
        byId.set(transaction.id, transaction);
      }
    });

  const bySignature = new Map();
  Array.from(byId.values()).forEach((transaction) => {

    const signature = getTransactionSignature(transaction);

    const existing = bySignature.get(signature);

    if (shouldReplaceMergedTransaction(existing, transaction)) {
      bySignature.set(signature, transaction);
    }
  });

  const records = Array.from(bySignature.values());
  return coalesceLegacyTransferPairs(removeLegacyRowsCoveredByTransfers(records)).sort(compareTransactionsNewestFirst);
}

function isTransferLikeRecord(item) {

  const text = normalizeBankText([item?.title, item?.category, item?.note].filter(Boolean).join(" "));

  if (!text) {
    return false;
  }

  return [
    "transfer",
    "para transferi",
    "hesap transferi",
    "hesap aktarimi",
    "aktarim",
    "aktarma",
    "virman",
    "havale",
    "eft",
    "fast",
    "hesaba",
    "hesabima",
    "hesabindan",
    "diger hesap",
    "maas hesab",
    "kart odemesi",
  ].some((keyword) => text.includes(keyword));
}

function areSameTransactionAmount(first, second) {
  return Math.abs(Number(first?.amount || 0) - Number(second?.amount || 0)) < 0.01;
}

function getComparableTransactionMinute(item) {

  const time = getTransactionTime(item);
  return time ? time.slice(0, 5) : "";
}

function haveCompatibleTransferTimes(first, second) {

  const firstMinute = getComparableTransactionMinute(first);

  const secondMinute = getComparableTransactionMinute(second);
  return !firstMinute || !secondMinute || firstMinute === secondMinute;
}

function hasSameTransferDayAndAmount(first, second) {
  return (
    String(first?.date || "") === String(second?.date || "") &&
    areSameTransactionAmount(first, second) &&
    haveCompatibleTransferTimes(first, second)
  );
}

function isLegacySplitRowForTransfer(transfer, candidate) {
  if (!transfer || !candidate || transfer.type !== "transfer" || candidate.type === "transfer") {
    return false;
  }

  if (!hasSameTransferDayAndAmount(transfer, candidate)) {
    return false;
  }

  const sourceId = String(transfer.paymentAccountId || "");

  const targetId = String(transfer.transferAccountId || "");

  const candidateAccountId = String(candidate.paymentAccountId || "");

  if (!sourceId || !targetId || !candidateAccountId) {
    return false;
  }

  const isSourceExpense = candidate.type === "expense" && candidateAccountId === sourceId;

  const isTargetIncome = candidate.type === "income" && candidateAccountId === targetId;

  return (isSourceExpense || isTargetIncome) && isTransferLikeRecord(candidate);
}

function removeLegacyRowsCoveredByTransfers(source = []) {

  const transfers = source.filter((item) => item.type === "transfer");

  if (!transfers.length) {
    return source;
  }

  return source.filter((item) => {
    if (item.type === "transfer") {
      return true;
    }

    return !transfers.some((transfer) => transfer.id !== item.id && isLegacySplitRowForTransfer(transfer, item));
  });
}

function isLikelySplitTransferPair(first, second) {
  if (!first || !second || first.type === second.type || first.type === "transfer" || second.type === "transfer") {
    return false;
  }

  if (!hasSameTransferDayAndAmount(first, second)) {
    return false;
  }

  const firstAccountId = String(first.paymentAccountId || "");

  const secondAccountId = String(second.paymentAccountId || "");

  if (!firstAccountId || !secondAccountId || firstAccountId === secondAccountId) {
    return false;
  }

  return isTransferLikeRecord(first) || isTransferLikeRecord(second);
}

function getTransactionPairScore(first, second) {

  let score = 0;

  if (getComparableTransactionMinute(first) && getComparableTransactionMinute(first) === getComparableTransactionMinute(second)) {
    score += 4;
  }

  if (normalizeBankText(first.note) && normalizeBankText(first.note) === normalizeBankText(second.note)) {
    score += 2;
  }

  if (isTransferLikeRecord(first)) score += 1;
  if (isTransferLikeRecord(second)) score += 1;

  return score;
}

function buildTransferFromSplitPair(first, second) {

  const expense = first.type === "expense" ? first : second;

  const income = first.type === "income" ? first : second;

  const updatedAt = [expense.updatedAt, income.updatedAt]
    .filter(Boolean)
    .sort((left, right) => getRecordTimestamp(right) - getRecordTimestamp(left))[0] || getTurkeyNowDateTime();

  const createdAt = [expense.createdAt, income.createdAt].filter(Boolean).sort()[0] || expense.createdAt || income.createdAt || updatedAt;

  const notes = [expense.note, income.note].map((value) => String(value || "").trim()).filter(Boolean);

  const uniqueNotes = [...new Set(notes)];

  return {
    ...expense,
    id: expense.id,
    type: "transfer",
    title: (expense.title || income.title || "Hesaplar Arası Transfer").slice(0, 40),
    amount: roundMoney(Number(expense.amount || income.amount || 0)),
    category: "Transfer",
    paymentMethod: "transfer",
    paymentAccountId: String(expense.paymentAccountId || ""),
    transferAccountId: String(income.paymentAccountId || ""),
    transferFee: 0,
    date: expense.date || income.date,
    note: uniqueNotes.join(" · ").slice(0, 100),
    transactionAt: expense.transactionAt || income.transactionAt || "",
    createdAt,
    updatedAt,
  };
}

function coalesceLegacyTransferPairs(source = []) {

  const records = [...source];

  const usedIds = new Set();

  const result = [];

  records.forEach((item) => {
    if (usedIds.has(item.id)) {
      return;
    }

    if (item.type !== "expense") {
      return;
    }

    const candidates = records
      .filter((candidate) => !usedIds.has(candidate.id) && candidate.id !== item.id && candidate.type === "income")
      .filter((candidate) => isLikelySplitTransferPair(item, candidate))
      .sort((first, second) => getTransactionPairScore(item, second) - getTransactionPairScore(item, first));

    if (!candidates.length) {
      return;
    }

    const income = candidates[0];
    usedIds.add(item.id);
    usedIds.add(income.id);
    result.push(buildTransferFromSplitPair(item, income));
  });

  records.forEach((item) => {
    if (!usedIds.has(item.id)) {
      result.push(item);
    }
  });

  return result;
}

function getLegacyTransferCounterpartIds(transfer, previousTransaction = null) {

  const ids = new Set();

  if (!transfer || transfer.type !== "transfer") {
    return ids;
  }

  transactions.forEach((candidate) => {
    if (candidate.id === transfer.id || isTransactionDeleted(candidate.id)) {
      return;
    }

    if (isLegacySplitRowForTransfer(transfer, candidate)) {
      ids.add(candidate.id);
      return;
    }

    if (previousTransaction && isLikelySplitTransferPair(previousTransaction, candidate)) {

      const previousWasSourceExpense = previousTransaction.type === "expense";

      const candidateIsTargetIncome = candidate.type === "income" && String(candidate.paymentAccountId || "") === String(transfer.transferAccountId || "");

      const previousWasTargetIncome = previousTransaction.type === "income";

      const candidateIsSourceExpense = candidate.type === "expense" && String(candidate.paymentAccountId || "") === String(transfer.paymentAccountId || "");

      if ((previousWasSourceExpense && candidateIsTargetIncome) || (previousWasTargetIncome && candidateIsSourceExpense)) {
        ids.add(candidate.id);
      }
    }
  });

  return ids;
}

function isSampleTransaction(item) {
  return ["Nisan Maaşı", "Haftalık Market", "Elektrik Faturası"].includes(item.title);
}

function getFirebaseErrorMessage(error) {

  const code = error && error.code;

  if (code === "auth/email-already-in-use") {
    return "Bu e-posta ile hesap zaten var. Giriş yapmayı dene.";
  }

  if (code === "auth/requires-recent-login") {
    return "Güvenlik için yeniden giriş yapıp profil güncellemeyi tekrar dene.";
  }

  if (code === "auth/invalid-email") {
    return "E-posta adresi geçerli değil.";
  }

  if (code === "auth/weak-password") {
    return "Şifre en az 6 karakter olmalı.";
  }

  if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
    return "E-posta veya şifre hatalı.";
  }

  if (code === "auth/missing-email") {
    return "Parola sıfırlama için e-posta adresi gerekli.";
  }

  return error && error.message ? error.message : "İşlem tamamlanamadı.";
}
