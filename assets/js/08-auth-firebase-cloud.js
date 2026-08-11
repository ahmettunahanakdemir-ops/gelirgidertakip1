// ACIKLAMA: Firebase giris/kayit, profil yonetimi, bulut yedek ve Firestore esitleme akislarini yonetir.
// ACIKLAMA: Bu dosya ayrilan JS yapisinin bir parcasidir; index.html icindeki yukleme sirasi onemlidir.

function initCloud() {
  renderAuthState();

  if (!window.firebase) {
    cloudStatus.textContent = "Firebase dosyaları yüklenemedi. Bağlantıyı kontrol et veya uygulamayı yayınlı adresten aç.";
    return;
  }

  // ACIKLAMA: config degiskeninin Turkce karsiligi "config"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: enableFirestoreOfflineCache fonksiyonunun Turkce karsiligi "enable Firestore offline onbellek"; ilgili uygulama islemini calistirir.
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

// ACIKLAMA: ensureCloudReady fonksiyonunun Turkce karsiligi "garanti et bulut hazir"; bulut ve yerel veri esitleme akisini yonetir.
function ensureCloudReady(statusElement = cloudStatus) {
  if (firebaseAuth && firebaseDb) {
    return true;
  }

  initCloud();
  // ACIKLAMA: ready degiskeninin Turkce karsiligi "hazir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const ready = Boolean(firebaseAuth && firebaseDb);

  if (!ready && statusElement && statusElement !== cloudStatus) {
    statusElement.textContent = cloudStatus.textContent;
  }

  return ready;
}

// ACIKLAMA: hasUsableFirebaseConfig fonksiyonunun Turkce karsiligi "var mi kullanilabilir Firebase config"; Firebase veya kimlik dogrulama islemlerini yonetir.
function hasUsableFirebaseConfig(config) {
  // ACIKLAMA: requiredKeys degiskeninin Turkce karsiligi "gerekli anahtarlar"; ilgili veri veya servis icin anahtar bilgisini tutar.
  const requiredKeys = ["apiKey", "authDomain", "projectId", "appId"];

  return (
    config &&
    requiredKeys.every((key) => {
      // ACIKLAMA: value degiskeninin Turkce karsiligi "deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const value = String(config[key] || "");
      return value && !value.includes("BURAYA_") && !value.includes("PROJECT_ID");
    })
  );
}

// ACIKLAMA: showAuthPanel fonksiyonunun Turkce karsiligi "goster kimlik dogrulama panel"; Firebase veya kimlik dogrulama islemlerini yonetir.
function showAuthPanel(panelName) {
  // ACIKLAMA: panels degiskeninin Turkce karsiligi "panels"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: openSignupPanel fonksiyonunun Turkce karsiligi "ac signup panel"; ilgili pencereyi veya ekrani acar.
function openSignupPanel() {
  // ACIKLAMA: loginValue degiskeninin Turkce karsiligi "login deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: openResetPanel fonksiyonunun Turkce karsiligi "ac sifirla panel"; ilgili pencereyi veya ekrani acar.
function openResetPanel() {
  // ACIKLAMA: loginValue degiskeninin Turkce karsiligi "login deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const loginValue = authEmail.value.trim();

  resetEmail.value = loginValue.includes("@") ? loginValue.toLowerCase() : "";
  resetStatus.textContent = "";
  showAuthPanel("reset");
  setTimeout(() => resetEmail.focus(), 0);
}

// ACIKLAMA: signInWithEmail fonksiyonunun Turkce karsiligi "isaret in with e-posta"; AI destekli okuma veya API istegi akisini calistirir.
async function signInWithEmail() {
  // ACIKLAMA: credentials degiskeninin Turkce karsiligi "credentials"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const credentials = getAuthCredentials();

  if (!credentials) {
    return;
  }

  if (!ensureCloudReady(signupStatus)) {
    return;
  }

  try {
    cloudStatus.textContent = "Giriş yapılıyor...";
    await firebaseAuth.signInWithEmailAndPassword(credentials.email, credentials.password);
    saveLastUsername(credentials.username);
  } catch (error) {
    cloudStatus.textContent = getFirebaseErrorMessage(error);
  }
}

// ACIKLAMA: createAccountWithEmail fonksiyonunun Turkce karsiligi "olustur hesap with e-posta"; AI destekli okuma veya API istegi akisini calistirir.
async function createAccountWithEmail(event) {
  event.preventDefault();
  // ACIKLAMA: credentials degiskeninin Turkce karsiligi "credentials"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const credentials = getSignupCredentials();

  if (!credentials) {
    return;
  }

  if (!ensureCloudReady(resetStatus)) {
    return;
  }

  try {
    signupStatus.textContent = "Hesap oluşturuluyor...";
    // ACIKLAMA: userCredential degiskeninin Turkce karsiligi "kullanici credential"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const userCredential = await firebaseAuth.createUserWithEmailAndPassword(
      credentials.email,
      credentials.password
    );

    if (userCredential.user) {
      await userCredential.user.updateProfile({ displayName: credentials.username });
      await userCredential.user.reload();
      currentUser = firebaseAuth.currentUser || userCredential.user;
    }

    saveLastUsername(credentials.username);
    renderAuthState();
    await syncUserProfileToCloud();
    signupStatus.textContent = "Hesap oluşturuldu. Bulut kayıtların hazırlanıyor...";
  } catch (error) {
    signupStatus.textContent = getFirebaseErrorMessage(error);
  }
}

// ACIKLAMA: sendPasswordReset fonksiyonunun Turkce karsiligi "send sifre sifirla"; ilgili uygulama islemini calistirir.
async function sendPasswordReset(event) {
  event.preventDefault();
  // ACIKLAMA: email degiskeninin Turkce karsiligi "e-posta"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: signOutUser fonksiyonunun Turkce karsiligi "isaret out kullanici"; ilgili uygulama islemini calistirir.
async function signOutUser() {
  if (!firebaseAuth) {
    return;
  }

  closeProfileModal();
  currentUser = null;
  renderAuthState();
  await firebaseAuth.signOut();
}

// ACIKLAMA: openProfileModal fonksiyonunun Turkce karsiligi "profil penceresini ac"; ilgili pencereyi veya ekrani acar.
function openProfileModal() {
  if (!currentUser) {
    return;
  }

  switchView("userView");
  fillProfileForm();
  setTimeout(() => profileUsername?.focus(), 0);
}

// ACIKLAMA: fillProfileForm fonksiyonunun Turkce karsiligi "fill profil form"; ilgili uygulama islemini calistirir.
function fillProfileForm() {
  if (!currentUser || !profileForm) {
    return;
  }

  profileUsername.value = getUserDisplayName(currentUser);
  profileCurrentPassword.value = "";
  profilePassword.value = "";
  profileStatus.textContent = "";
  closeDeleteAccountModal();
  closeConfirmDeleteAccountModal();
  if (deleteUserStatus) {
    deleteUserStatus.textContent = "";
  }
}

// ACIKLAMA: closeProfileModal fonksiyonunun Turkce karsiligi "kapat profil pencere"; ilgili pencereyi veya ekrani kapatir.
function closeProfileModal() {
  if (!profileModal) {
    return;
  }

  profileModal.hidden = true;
}

// ACIKLAMA: updateProfile fonksiyonunun Turkce karsiligi "guncelle profil"; mevcut ekran durumunu veya hesaplanan degerleri gunceller.
async function updateProfile(event) {
  event.preventDefault();

  if (!currentUser || !firebaseAuth) {
    profileStatus.textContent = "Profil güncellemek için giriş yapmalısın.";
    return;
  }

  // ACIKLAMA: username degiskeninin Turkce karsiligi "kullanici adi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const username = profileUsername.value.trim();
  // ACIKLAMA: currentPassword degiskeninin Turkce karsiligi "mevcut sifre"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const currentPassword = profileCurrentPassword.value;
  // ACIKLAMA: nextPassword degiskeninin Turkce karsiligi "sonraki sifre"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const nextPassword = profilePassword.value;

  if (!username) {
    profileStatus.textContent = "Kullanıcı adı boş olamaz.";
    return;
  }

  if (nextPassword && nextPassword.length < 6) {
    profileStatus.textContent = "Yeni şifre en az 6 karakter olmalı.";
    return;
  }

  // ACIKLAMA: usernameChanged degiskeninin Turkce karsiligi "kullanici adi changed"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const usernameChanged = username !== getUserDisplayName(currentUser);
  // ACIKLAMA: passwordChanged degiskeninin Turkce karsiligi "sifre changed"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const passwordChanged = Boolean(nextPassword);

  if (!usernameChanged && !passwordChanged) {
    profileStatus.textContent = "Güncellenecek bir değişiklik yok.";
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

    await currentUser.reload();
    currentUser = firebaseAuth.currentUser || currentUser;
    saveLastUsername(getUserDisplayName(currentUser));
    renderAuthState();
    await syncTransactionsToCloud({ replace: true });
    profileCurrentPassword.value = "";
    profilePassword.value = "";
    profileStatus.textContent = "Profil güncellendi.";
  } catch (error) {
    profileStatus.textContent = getFirebaseErrorMessage(error);
  }
}

// ACIKLAMA: reauthenticateCurrentUser fonksiyonunun Turkce karsiligi "reauthenticate mevcut kullanici"; Firebase veya kimlik dogrulama islemlerini yonetir.
async function reauthenticateCurrentUser(password) {
  // ACIKLAMA: credential degiskeninin Turkce karsiligi "credential"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const credential = window.firebase.auth.EmailAuthProvider.credential(currentUser.email, password);
  await currentUser.reauthenticateWithCredential(credential);
}

// ACIKLAMA: openDeleteAccountModal fonksiyonunun Turkce karsiligi "ac sil hesap pencere"; ilgili pencereyi veya ekrani acar.
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

// ACIKLAMA: closeDeleteAccountModal fonksiyonunun Turkce karsiligi "kapat sil hesap pencere"; ilgili pencereyi veya ekrani kapatir.
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

// ACIKLAMA: requestDeleteAccountConfirmation fonksiyonunun Turkce karsiligi "istek sil hesap confirmation"; secilen kaydi siler veya listeden kaldirir.
function requestDeleteAccountConfirmation(event) {
  event.preventDefault();

  if (!currentUser || !firebaseAuth || !firebaseDb) {
    deleteAccountStatus.textContent = "Kullanıcı silmek için giriş yapmalısın.";
    return;
  }

  // ACIKLAMA: password degiskeninin Turkce karsiligi "sifre"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const password = deleteUserPassword.value;
  // ACIKLAMA: passwordConfirm degiskeninin Turkce karsiligi "sifre onay"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: closeConfirmDeleteAccountModal fonksiyonunun Turkce karsiligi "kapat onay sil hesap pencere"; ilgili pencereyi veya ekrani kapatir.
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

// ACIKLAMA: deleteCurrentUserAccount fonksiyonunun Turkce karsiligi "sil mevcut kullanici hesap"; secilen kaydi siler veya listeden kaldirir.
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

  // ACIKLAMA: user degiskeninin Turkce karsiligi "kullanici"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const user = currentUser;

  try {
    confirmDeleteAccountStatus.textContent = "Kullanıcı ve bulut kayıtları siliniyor...";
    await reauthenticateCurrentUser(pendingDeletePassword);
    await deleteUserCloudData(user.uid);
    clearUserLocalData(user.uid);
    await user.delete();
    transactions = [];
    assets = [];
    besAccounts = [];
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

// ACIKLAMA: deleteUserCloudData fonksiyonunun Turkce karsiligi "sil kullanici bulut veri"; secilen kaydi siler veya listeden kaldirir.
async function deleteUserCloudData(userId) {
  // ACIKLAMA: collection degiskeninin Turkce karsiligi "koleksiyon"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const collection = getUserTransactionsCollection(userId);
  // ACIKLAMA: snapshot degiskeninin Turkce karsiligi "snapshot"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const snapshot = await collection.get();
  // ACIKLAMA: batch degiskeninin Turkce karsiligi "toplu islem"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let batch = firebaseDb.batch();
  // ACIKLAMA: operationCount degiskeninin Turkce karsiligi "operation sayi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: clearUserLocalData fonksiyonunun Turkce karsiligi "temizle kullanici yerel veri"; ilgili uygulama islemini calistirir.
function clearUserLocalData(userId) {
  [
    STORAGE_KEY,
    ASSETS_STORAGE_KEY,
    BES_STORAGE_KEY,
    PAYMENT_ACCOUNTS_STORAGE_KEY,
    DELETED_TRANSACTIONS_STORAGE_KEY,
    DELETED_TRANSACTION_SIGNATURES_STORAGE_KEY,
    DELETED_TRANSFER_TOMBSTONES_STORAGE_KEY,
    DELETED_ASSET_TOMBSTONES_STORAGE_KEY,
    DELETED_BES_TOMBSTONES_STORAGE_KEY,
    PROFILE_CLOUD_DIRTY_STORAGE_KEY,
  ].forEach((baseKey) => {
    localStorage.removeItem(`${baseKey}-${userId}`);
  });
}

// ACIKLAMA: getAuthCredentials fonksiyonunun Turkce karsiligi "al kimlik dogrulama credentials"; Firebase veya kimlik dogrulama islemlerini yonetir.
function getAuthCredentials() {
  // ACIKLAMA: username degiskeninin Turkce karsiligi "kullanici adi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const username = authEmail.value.trim();
  // ACIKLAMA: password degiskeninin Turkce karsiligi "sifre"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const password = authPassword.value;

  if (!username || password.length < 6) {
    cloudStatus.textContent = "Kullanıcı adı/e-posta ve en az 6 karakterli şifre gir.";
    return null;
  }

  return { email: usernameToEmail(username), password, username };
}

// ACIKLAMA: getSignupCredentials fonksiyonunun Turkce karsiligi "al signup credentials"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getSignupCredentials() {
  // ACIKLAMA: email degiskeninin Turkce karsiligi "e-posta"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const email = signupEmail.value.trim().toLowerCase();
  // ACIKLAMA: username degiskeninin Turkce karsiligi "kullanici adi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const username = signupUsername.value.trim();
  // ACIKLAMA: password degiskeninin Turkce karsiligi "sifre"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const password = signupPassword.value;
  // ACIKLAMA: confirmPassword degiskeninin Turkce karsiligi "onay sifre"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: loadLastUsername fonksiyonunun Turkce karsiligi "yukle son kullanici adi"; ilgili uygulama islemini calistirir.
function loadLastUsername() {
  try {
    return localStorage.getItem(LAST_USERNAME_KEY) || "";
  } catch {
    return "";
  }
}

// ACIKLAMA: saveLastUsername fonksiyonunun Turkce karsiligi "kaydet son kullanici adi"; formdan gelen bilgiyi kaydeder veya yeni kayit ekler.
function saveLastUsername(emailOrUsername) {
  // ACIKLAMA: username degiskeninin Turkce karsiligi "kullanici adi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: usernameToEmail fonksiyonunun Turkce karsiligi "kullanici adi ile e-posta"; AI destekli okuma veya API istegi akisini calistirir.
function usernameToEmail(username) {
  // ACIKLAMA: value degiskeninin Turkce karsiligi "deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const value = String(username || "").trim();

  if (value.includes("@")) {
    return value.toLowerCase();
  }

  // ACIKLAMA: safeUsername degiskeninin Turkce karsiligi "guvenli kullanici adi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const safeUsername = normalizeBankText(value).replace(/\s+/g, "");
  return `${safeUsername}@${USERNAME_EMAIL_DOMAIN}`;
}

// ACIKLAMA: emailToUsername fonksiyonunun Turkce karsiligi "e-posta ile kullanici adi"; AI destekli okuma veya API istegi akisini calistirir.
function emailToUsername(email) {
  // ACIKLAMA: value degiskeninin Turkce karsiligi "deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const value = String(email || "");
  // ACIKLAMA: suffix degiskeninin Turkce karsiligi "suffix"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const suffix = `@${USERNAME_EMAIL_DOMAIN}`;

  return value.endsWith(suffix) ? value.slice(0, -suffix.length) : value;
}

// ACIKLAMA: getUserDisplayName fonksiyonunun Turkce karsiligi "al kullanici display adi"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getUserDisplayName(user = currentUser) {
  if (!user) {
    return "";
  }

  return (user.displayName || emailToUsername(user.email) || "").trim();
}

// ACIKLAMA: handleAuthStateChanged fonksiyonunun Turkce karsiligi "handle kimlik dogrulama durum changed"; Firebase veya kimlik dogrulama islemlerini yonetir.
async function handleAuthStateChanged(user) {
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
    refreshCardReminderSettingsForCurrentUser();
    transactions = loadTransactions();
    assets = loadAssets();
    besAccounts = loadBesAccounts();
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

  // ACIKLAMA: anonymousLocalTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
  const anonymousLocalTransactions = getCloudReadyTransactions(transactions);
  // ACIKLAMA: anonymousLocalAssets varlik/portfoy ekraniyla ilgili veriyi veya DOM elemanini tutar.
  const anonymousLocalAssets = getCloudReadyAssets(assets);
  // ACIKLAMA: anonymousLocalBesAccounts degiskeninin Turkce karsiligi "anonymous yerel BES hesaplar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const anonymousLocalBesAccounts = getCloudReadyBesAccounts(besAccounts);
  // ACIKLAMA: anonymousLocalPaymentAccounts kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
  const anonymousLocalPaymentAccounts = getCloudReadyPaymentAccounts(paymentAccounts);
  // ACIKLAMA: anonymousLocalCategories degiskeninin Turkce karsiligi "anonymous yerel kategoriler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const anonymousLocalCategories = normalizeCategoryState(transactionCategories);
  // ACIKLAMA: anonymousDeletedTransactionState gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
  const anonymousDeletedTransactionState = getDeletedTransactionStateSnapshot();
  // ACIKLAMA: Giris oncesindeki varlik ve BES silme izleri kullanici hesabiyla birlestirilir.
  const anonymousDeletedProfileRecordState = getDeletedProfileRecordStateSnapshot();
  // ACIKLAMA: anonymousLocalTransactionsUpdatedAt gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
  const anonymousLocalTransactionsUpdatedAt = loadTransactionsStateUpdatedAt();
  currentUser = user;
  deletedTransactionIds = loadDeletedTransactionIds();
  deletedTransactionSignatures = loadDeletedTransactionSignatures();
  deletedTransferTombstones = loadDeletedTransferTombstones();
  deletedAssetTombstones = loadDeletedAssetTombstones();
  deletedBesTombstones = loadDeletedBesTombstones();
  applyDeletedTransactionState(anonymousDeletedTransactionState, getDeletedTransactionStateSnapshot());
  applyDeletedProfileRecordState(anonymousDeletedProfileRecordState, getDeletedProfileRecordStateSnapshot());
  refreshCardReminderSettingsForCurrentUser();
  // ACIKLAMA: userLocalTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
  const userLocalTransactions = getCloudReadyTransactions(loadTransactions());
  // ACIKLAMA: userLocalTransactionsUpdatedAt gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
  const userLocalTransactionsUpdatedAt = loadTransactionsStateUpdatedAt();
  // ACIKLAMA: userLocalAssets varlik/portfoy ekraniyla ilgili veriyi veya DOM elemanini tutar.
  const userLocalAssets = getCloudReadyAssets(loadAssets());
  // ACIKLAMA: userLocalBesAccounts degiskeninin Turkce karsiligi "kullanici yerel BES hesaplar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const userLocalBesAccounts = getCloudReadyBesAccounts(loadBesAccounts());
  // ACIKLAMA: userLocalPaymentAccounts kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
  const userLocalPaymentAccounts = getCloudReadyPaymentAccounts(loadPaymentAccounts());
  // ACIKLAMA: userLocalCategories degiskeninin Turkce karsiligi "kullanici yerel kategoriler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
    cloudStatus.textContent = "Bulut kayıtları yükleniyor...";

  try {
    // ACIKLAMA: cloudProfile degiskeninin Turkce karsiligi "bulut profil"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const cloudProfile = await fetchCloudProfile(user.uid);
    updateCloudBackupStatus(cloudProfile);
    applyDeletedTransactionState(readCloudDeletedTransactionState(cloudProfile), anonymousDeletedTransactionState);
    applyDeletedProfileRecordState(
      readCloudDeletedProfileRecordState(cloudProfile),
      anonymousDeletedProfileRecordState
    );
    // ACIKLAMA: cloudProfileTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
    const cloudProfileTransactions = readCloudTransactionBackupArray(cloudProfile.transactionsBackup);
    // ACIKLAMA: cloudCollectionTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
    let cloudCollectionTransactions = [];

    try {
      cloudCollectionTransactions = await fetchCloudTransactions(user.uid, { source: "server" });
    } catch {
      cloudCollectionTransactions = await fetchCloudTransactions(user.uid).catch(() => []);
    }

    // ACIKLAMA: cloudTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
    const cloudTransactions = mergeTransactions(cloudProfileTransactions, cloudCollectionTransactions);
    // ACIKLAMA: localTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
    const localTransactions = mergeTransactions(userLocalTransactions, anonymousLocalTransactions);
    // ACIKLAMA: localTransactionsUpdatedAt gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
    const localTransactionsUpdatedAt = Math.max(
      userLocalTransactionsUpdatedAt,
      anonymousLocalTransactionsUpdatedAt,
      getTransactionsNewestMutationTimestamp(localTransactions)
    );
    // ACIKLAMA: cloudTransactionsUpdatedAt gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
    const cloudTransactionsUpdatedAt =
      getRecordTimestamp(cloudProfile?.transactionsStateUpdatedAt) ||
      getRecordTimestamp(cloudProfile?.transactionsBackupUpdatedAt) ||
      getTransactionsNewestMutationTimestamp(cloudTransactions);

    transactions = mergeTransactions(cloudTransactions, localTransactions);
    assets = applyDeletedProfileTombstones(
      mergeVersionedRecordsById(readCloudAssets(cloudProfile.assets), userLocalAssets, anonymousLocalAssets),
      deletedAssetTombstones
    );
    besAccounts = applyDeletedProfileTombstones(
      mergeVersionedRecordsById(
        readCloudBesAccounts(cloudProfile.besAccounts),
        userLocalBesAccounts,
        anonymousLocalBesAccounts
      ),
      deletedBesTombstones
    );
    paymentAccounts = mergeRecordsById(
      readCloudPaymentAccounts(cloudProfile.paymentAccounts),
      userLocalPaymentAccounts,
      anonymousLocalPaymentAccounts
    );
    transactionCategories = mergeCategoryStates(
      readCloudTransactionCategories(cloudProfile.transactionCategories),
      userLocalCategories,
      anonymousLocalCategories,
      getTransactionCategoriesFromRecords(transactions)
    );
    // ACIKLAMA: pendingLocalTransactionUpserts degiskeninin Turkce karsiligi "bekleyen yerel islem upserts"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const pendingLocalTransactionUpserts = getPendingLocalTransactionUpserts(localTransactions, cloudTransactions);
    // ACIKLAMA: pendingLocalTransactionDeletes degiskeninin Turkce karsiligi "bekleyen yerel islem deletes"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const pendingLocalTransactionDeletes = getPendingLocalTransactionDeletes(cloudTransactions);
    // ACIKLAMA: hasStaleLocalSyncFlag degiskeninin Turkce karsiligi "var mi stale yerel esitle flag"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const hasStaleLocalSyncFlag = loadTransactionsCloudDirtyAt() > 0 || isTransactionsCloudFullSyncRequired();
    // ACIKLAMA: hasPendingLocalTransactionSync gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
    const hasPendingLocalTransactionSync =
      pendingLocalTransactionUpserts.length > 0 ||
      pendingLocalTransactionDeletes.length > 0;

    refreshAllPaymentAccountsFromRecords({ silent: true, syncCloud: false });
    persistTransactions({ syncCloud: false });
    persistAssets({ syncCloud: false });
    persistBesAccounts({ syncCloud: false });
    persistPaymentAccounts({ syncCloud: false });
    persistTransactionCategories({ syncCloud: false });
    syncCategorySelects();
    render();
    // ACIKLAMA: syncTasks degiskeninin Turkce karsiligi "esitle tasks"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
    // ACIKLAMA: syncResults degiskeninin Turkce karsiligi "esitle results"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const syncResults = await Promise.allSettled(syncTasks);
    // ACIKLAMA: failedSync degiskeninin Turkce karsiligi "failed esitle"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const failedSync = syncResults.find((result) => result.status === "rejected");
    subscribeCloudTransactions(user.uid);
    subscribeCloudProfile(user.uid);
    bindPendingCloudSyncEvents();
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
    cloudStatus.textContent = `Bulut kayıtları yüklenemedi: ${error.message}`;
  }
}


// ACIKLAMA: setLoggedOutVisualState fonksiyonunun Turkce karsiligi "ayarla logged out visual durum"; ilgili uygulama islemini calistirir.
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

// ACIKLAMA: setLoggedInVisualState fonksiyonunun Turkce karsiligi "ayarla logged in visual durum"; ilgili uygulama islemini calistirir.
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

// ACIKLAMA: renderAuthState fonksiyonunun Turkce karsiligi "ekrana bas kimlik dogrulama durum"; ilgili ekran, liste veya kartlari ekrana basar.
function renderAuthState() {
  // ACIKLAMA: signedIn degiskeninin Turkce karsiligi "isaretli in"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const signedIn = Boolean(currentUser);
  // ACIKLAMA: hasOpenAuthSubPanel degiskeninin Turkce karsiligi "var mi ac kimlik dogrulama sub panel"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
  appUserEmail.textContent = signedIn ? getUserDisplayName(currentUser) || "Bulut hesabı" : "";
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

// ACIKLAMA: fetchCloudProfile fonksiyonunun Turkce karsiligi "getir bulut profil"; bulut ve yerel veri esitleme akisini yonetir.
function fetchCloudProfile(userId) {
  return firebaseDb
    .collection("users")
    .doc(userId)
    .get()
    .then((doc) => (doc.exists ? doc.data() || {} : {}));
}

// ACIKLAMA: subscribeCloudProfile fonksiyonunun Turkce karsiligi "abonelik baslat bulut profil"; bulut ve yerel veri esitleme akisini yonetir.
function subscribeCloudProfile(userId) {
  profileUnsubscribe = firebaseDb
    .collection("users")
    .doc(userId)
    .onSnapshot(
      { includeMetadataChanges: true },
      (doc) => {
        // ACIKLAMA: data degiskeninin Turkce karsiligi "veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
        const data = doc.data() || {};
        updateCloudBackupStatus(data);
        applyDeletedProfileRecordState(readCloudDeletedProfileRecordState(data));

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
          // ACIKLAMA: profileTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
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
        renderHome();
      },
      (error) => {
        cloudStatus.textContent = `Profil dinleme hatası: ${error.message}`;
      }
    );
}

// ACIKLAMA: fetchCloudTransactions fonksiyonunun Turkce karsiligi "getir bulut islemler"; bulut ve yerel veri esitleme akisini yonetir.
function fetchCloudTransactions(userId, options = {}) {
  // ACIKLAMA: getOptions degiskeninin Turkce karsiligi "al options"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const getOptions = options.source ? { source: options.source } : undefined;
  return getUserTransactionsCollection(userId)
    .get(getOptions)
    .then((snapshot) => snapshot.docs.map(readCloudTransaction).filter(Boolean).filter((item) => !isTransactionDeleted(item)));
}

// ACIKLAMA: subscribeCloudTransactions fonksiyonunun Turkce karsiligi "abonelik baslat bulut islemler"; bulut ve yerel veri esitleme akisini yonetir.
function subscribeCloudTransactions(userId) {
  cloudUnsubscribe = getUserTransactionsCollection(userId).onSnapshot(
    { includeMetadataChanges: true },
    (snapshot) => {
      // ACIKLAMA: cloudTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
      const cloudTransactions = snapshot.docs
        .map(readCloudTransaction)
        .filter(Boolean)
        .filter((item) => !isTransactionDeleted(item));

      if (snapshot.metadata?.hasPendingWrites || cloudTransactionsSyncInFlight) {
        cloudStatus.textContent = `${transactions.length} kayıt buluta yazılıyor...`;
        return;
      }

      // ACIKLAMA: localUpdatedAt degiskeninin Turkce karsiligi "yerel updated at"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const localUpdatedAt = Math.max(
        loadTransactionsStateUpdatedAt(),
        getTransactionsNewestMutationTimestamp(transactions)
      );
      // ACIKLAMA: cloudProfileUpdatedAt degiskeninin Turkce karsiligi "bulut profil updated at"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const cloudProfileUpdatedAt = 0;
      // ACIKLAMA: cloudUpdatedAt degiskeninin Turkce karsiligi "bulut updated at"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
      refreshAllPaymentAccountsFromRecords({ silent: true, syncCloud: true });
      render();
      // ACIKLAMA: sourceLabel degiskeninin Turkce karsiligi "kaynak etiket"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const sourceLabel = snapshot.metadata?.fromCache ? "yerel önbellekten" : "buluttan";
      cloudStatus.textContent = `${transactions.length} kayıt ${sourceLabel} güncel.`;
    },
    (error) => {
      cloudStatus.textContent = `Bulut dinleme hatası: ${error.message}`;
    }
  );
}

// ACIKLAMA: getCloudWriteBatchLimit fonksiyonunun Turkce karsiligi "al bulut yaz toplu islem limit"; bulut ve yerel veri esitleme akisini yonetir.
function getCloudWriteBatchLimit() {
  // Firestore batch limiti 500'dür. Profil güncellemesi ve güvenli pay için 450 kullanıyoruz.
  return 450;
}

// ACIKLAMA: commitCloudOperationsInChunks fonksiyonunun Turkce karsiligi "kaydet bulut operations in parcalar"; bulut ve yerel veri esitleme akisini yonetir.
async function commitCloudOperationsInChunks(operations = []) {
  // ACIKLAMA: limit degiskeninin Turkce karsiligi "limit"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const limit = getCloudWriteBatchLimit();

  for (let index = 0; index < operations.length; index += limit) {
    // ACIKLAMA: batch degiskeninin Turkce karsiligi "toplu islem"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const batch = firebaseDb.batch();
    // ACIKLAMA: chunk degiskeninin Turkce karsiligi "parca"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: getJsonByteSize fonksiyonunun Turkce karsiligi "al JSON byte boyut"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getJsonByteSize(value) {
  try {
    return new Blob([JSON.stringify(value) || ""]).size;
  } catch {
    return Number.POSITIVE_INFINITY;
  }
}

// ACIKLAMA: createProfileTransactionBackupFields fonksiyonunun Turkce karsiligi "olustur profil islem yedekle alanlar"; kullanilacak veri yapisini veya HTML elemanini olusturur.
function createProfileTransactionBackupFields(safeTransactions = [], transactionsStateUpdatedAt = Date.now()) {
  // ACIKLAMA: backup degiskeninin Turkce karsiligi "yedekle"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const backup = safeTransactions.map(toCloudTransactionBackup);
  // ACIKLAMA: fullBackupFields degiskeninin Turkce karsiligi "tam yedekle alanlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: syncTransactionsToCloud fonksiyonunun Turkce karsiligi "islemleri bulutla esitle"; bulut ve yerel veri esitleme akisini yonetir.
function syncTransactionsToCloud(options = {}) {
  const { replace = false, upserts = null, deletes = null } = options;

  if (!currentUser || !firebaseDb) {
    return Promise.resolve();
  }

  // ACIKLAMA: user degiskeninin Turkce karsiligi "kullanici"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const user = currentUser;
  // ACIKLAMA: safeTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
  let safeTransactions = getCloudReadyTransactions(transactions).filter((item) => !isTransactionDeleted(item));
  // ACIKLAMA: deltaUpserts degiskeninin Turkce karsiligi "delta upserts"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let deltaUpserts = Array.isArray(upserts)
    ? getCloudReadyTransactions(upserts).filter((item) => !isTransactionDeleted(item))
    : null;
  // ACIKLAMA: deltaDeletes degiskeninin Turkce karsiligi "delta deletes"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let deltaDeletes = Array.isArray(deletes)
    ? deletes.map((id) => String(id || "")).filter(Boolean)
    : null;
  // ACIKLAMA: hasDeltaOperations degiskeninin Turkce karsiligi "var mi delta operations"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const hasDeltaOperations = !replace && (deltaUpserts !== null || deltaDeletes !== null);
  // ACIKLAMA: deletedPayload aktarim veya API istegi icin hazirlanan veri paketini tutar.
  const deletedPayload = getCloudDeletedTransactionPayload();
  // ACIKLAMA: transactionsStateUpdatedAt gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
  const transactionsStateUpdatedAt = saveTransactionsStateUpdatedAt();
  // ACIKLAMA: syncVersion degiskeninin Turkce karsiligi "esitle version"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const syncVersion = ++cloudTransactionsSyncVersion;
  // ACIKLAMA: isLatestSync degiskeninin Turkce karsiligi "mi latest esitle"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const isLatestSync = () => syncVersion === cloudTransactionsSyncVersion;
  // ACIKLAMA: shouldAbortStaleFullSync degiskeninin Turkce karsiligi "mali mi abort stale tam esitle"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const shouldAbortStaleFullSync = () => !hasDeltaOperations && !isLatestSync();
  cloudTransactionsSyncInFlight = true;

  // ACIKLAMA: writeTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
  const writeTransactions = async () => {
    try {
    if (shouldAbortStaleFullSync()) {
      return;
    }

    // ACIKLAMA: collection degiskeninin Turkce karsiligi "koleksiyon"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const collection = getUserTransactionsCollection(user.uid);

    if (!replace && !hasDeltaOperations) {
      // ACIKLAMA: latestCloudTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
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

    // ACIKLAMA: profileBackupFields degiskeninin Turkce karsiligi "profil yedekle alanlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const profileBackupFields = createProfileTransactionBackupFields(safeTransactions, transactionsStateUpdatedAt);
    // ACIKLAMA: profileBackupPayload aktarim veya API istegi icin hazirlanan veri paketini tutar.
    const profileBackupPayload = {
      email: user.email || "",
      username: getUserDisplayName(user),
      ...profileBackupFields,
      ...deletedPayload,
      transactionsStateUpdatedAt,
      updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
    };

    // ACIKLAMA: operations degiskeninin Turkce karsiligi "operations"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const operations = [];

    // ACIKLAMA: deletedIds degiskeninin Turkce karsiligi "silinmis kimlikler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
      // ACIKLAMA: snapshot degiskeninin Turkce karsiligi "snapshot"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const snapshot = await withTimeout(
        collection.get(),
        CLOUD_WRITE_TIMEOUT_MS,
        "Firebase kayıt listesi alınırken zaman aşımı oluştu."
      );

      if (shouldAbortStaleFullSync()) {
        return;
      }

      // ACIKLAMA: currentIds degiskeninin Turkce karsiligi "mevcut kimlikler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const currentIds = new Set(safeTransactions.map((item) => item.id));
      snapshot.docs.forEach((doc) => {
        if (!currentIds.has(doc.id)) {
          operations.push({ type: "delete", ref: doc.ref });
        }
      });
    }

    // ACIKLAMA: transactionsToWrite gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
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
        // ACIKLAMA: rulesHint degiskeninin Turkce karsiligi "rules hint"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

    // ACIKLAMA: profileWarning degiskeninin Turkce karsiligi "profil warning"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
      // ACIKLAMA: backupNote degiskeninin Turkce karsiligi "yedekle note"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const backupNote = profileBackupFields.transactionsBackupMode === "collection_only"
        ? " Profil yedeği büyüdüğü için kayıtların ana kaynağı transactions alt koleksiyonu."
        : "";
      // ACIKLAMA: savedCountText degiskeninin Turkce karsiligi "saved sayi metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

  // ACIKLAMA: runSync degiskeninin Turkce karsiligi "calistir esitle"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
        // ACIKLAMA: message degiskeninin Turkce karsiligi "mesaj"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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


// ACIKLAMA: pendingTransactionsCloudSyncTimer gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
let pendingTransactionsCloudSyncTimer = null;

// ACIKLAMA: schedulePendingTransactionsCloudSync fonksiyonunun Turkce karsiligi "zamanla bekleyen islemler bulut esitle"; bulut ve yerel veri esitleme akisini yonetir.
function schedulePendingTransactionsCloudSync(delay = 3500) {
  if (pendingTransactionsCloudSyncTimer) {
    window.clearTimeout(pendingTransactionsCloudSyncTimer);
  }

  pendingTransactionsCloudSyncTimer = window.setTimeout(() => {
    pendingTransactionsCloudSyncTimer = null;
    retryPendingTransactionsCloudSync();
  }, delay);
}

// ACIKLAMA: retryPendingTransactionsCloudSync fonksiyonunun Turkce karsiligi "yeniden dene bekleyen islemler bulut esitle"; bulut ve yerel veri esitleme akisini yonetir.
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
      // ACIKLAMA: pendingUpserts degiskeninin Turkce karsiligi "bekleyen upserts"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const pendingUpserts = getPendingLocalTransactionUpserts(transactions, cloudTransactions);
      // ACIKLAMA: pendingDeletes degiskeninin Turkce karsiligi "bekleyen deletes"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: bindPendingCloudSyncEvents fonksiyonunun Turkce karsiligi "bagla bekleyen bulut esitle events"; bulut ve yerel veri esitleme akisini yonetir.
function bindPendingCloudSyncEvents() {
  if (window.__akisBudgetPendingCloudSyncBound) {
    return;
  }

  window.__akisBudgetPendingCloudSyncBound = true;

  window.addEventListener("online", () => {
    retryPendingTransactionsCloudSync();
    retryPendingUserProfileCloudSync();
  });
  window.addEventListener("focus", () => {
    retryPendingTransactionsCloudSync();
    retryPendingUserProfileCloudSync();
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      retryPendingTransactionsCloudSync();
      retryPendingUserProfileCloudSync();
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

// ACIKLAMA: syncUserProfileToCloud fonksiyonunun Turkce karsiligi "esitle kullanici profil ile bulut"; bulut ve yerel veri esitleme akisini yonetir.
function syncUserProfileToCloud() {
  if (!currentUser || !firebaseDb) {
    return Promise.resolve();
  }

  // ACIKLAMA: user degiskeninin Turkce karsiligi "kullanici"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const user = currentUser;
  markUserProfileCloudDirty();
  // ACIKLAMA: syncVersion degiskeninin Turkce karsiligi "esitle version"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const syncVersion = ++cloudProfileSyncVersion;
  // ACIKLAMA: safeAssets varlik/portfoy ekraniyla ilgili veriyi veya DOM elemanini tutar.
  const safeAssets = getCloudReadyAssets(assets);
  // ACIKLAMA: safeBesAccounts degiskeninin Turkce karsiligi "guvenli BES hesaplar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const safeBesAccounts = getCloudReadyBesAccounts(besAccounts);
  // ACIKLAMA: safePaymentAccounts kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
  const safePaymentAccounts = getCloudReadyPaymentAccounts(paymentAccounts);
  // ACIKLAMA: safeTransactionCategories degiskeninin Turkce karsiligi "guvenli islem kategoriler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const safeTransactionCategories = normalizeCategoryState(transactionCategories);
  // ACIKLAMA: deletedPayload aktarim veya API istegi icin hazirlanan veri paketini tutar.
  const deletedPayload = getCloudDeletedTransactionPayload();
  const localDeletedProfileState = getDeletedProfileRecordStateSnapshot();
  const userRef = firebaseDb.collection("users").doc(user.uid);
  let committedAssets = safeAssets;
  let committedBesAccounts = safeBesAccounts;
  let committedDeletedProfileState = localDeletedProfileState;

  // ACIKLAMA: syncPromise degiskeninin Turkce karsiligi "esitle promise"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const syncPromise = firebaseDb
    .runTransaction(async (transaction) => {
      const snapshot = await transaction.get(userRef);
      const remoteProfile = snapshot.exists ? snapshot.data() || {} : {};

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

      transaction.set(
        userRef,
        {
          email: user.email || "",
          username: getUserDisplayName(user),
          assets: committedAssets,
          besAccounts: committedBesAccounts,
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
      applyDeletedProfileRecordState(committedDeletedProfileState);
      assets = applyDeletedProfileTombstones(
        mergeVersionedRecordsById(committedAssets, assets),
        deletedAssetTombstones
      );
      besAccounts = applyDeletedProfileTombstones(
        mergeVersionedRecordsById(committedBesAccounts, besAccounts),
        deletedBesTombstones
      );
      persistAssets({ syncCloud: false });
      persistBesAccounts({ syncCloud: false });
      renderAssets();
      renderBesAccounts();
      renderHome();
      if (syncVersion === cloudProfileSyncVersion) {
        clearUserProfileCloudDirty();
        cloudStatus.textContent = "Kart, hesap, varlık, BES ve kategori bilgileri buluta kaydedildi.";
      }
    })
    .catch((error) => {
      if (syncVersion === cloudProfileSyncVersion) {
        cloudStatus.textContent = `Profil buluta kaydedilemedi: ${error.message}`;
      }
    });

  return syncPromise;
}


// ACIKLAMA: getUserTransactionsCollection fonksiyonunun Turkce karsiligi "al kullanici islemler koleksiyon"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getUserTransactionsCollection(userId) {
  return firebaseDb.collection("users").doc(userId).collection("transactions");
}

// ACIKLAMA: toCloudTransaction fonksiyonunun Turkce karsiligi "ile bulut islem"; bulut ve yerel veri esitleme akisini yonetir.
function toCloudTransaction(transaction) {
  // ACIKLAMA: createdAt degiskeninin Turkce karsiligi "created at"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
    transactionAt: transaction.transactionAt || "",
    createdAt,
    updatedAt: transaction.updatedAt || window.firebase.firestore.FieldValue.serverTimestamp(),
  };
}

// ACIKLAMA: toCloudTransactionBackup fonksiyonunun Turkce karsiligi "ile bulut islem yedekle"; bulut ve yerel veri esitleme akisini yonetir.
function toCloudTransactionBackup(transaction) {
  // ACIKLAMA: createdAt degiskeninin Turkce karsiligi "created at"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
    transactionAt: transaction.transactionAt || "",
    createdAt,
    updatedAt: normalizeCloudTimestamp(transaction.updatedAt) || String(transaction.updatedAt || createdAt || getTurkeyNowDateTime()),
  };
}

// ACIKLAMA: readCloudTransaction fonksiyonunun Turkce karsiligi "oku bulut islem"; bulut ve yerel veri esitleme akisini yonetir.
function readCloudTransaction(doc) {
  // ACIKLAMA: data degiskeninin Turkce karsiligi "veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const data = doc.data() || {};
  // ACIKLAMA: updatedAt degiskeninin Turkce karsiligi "updated at"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const updatedAt = normalizeCloudTimestamp(data.updatedAt);
  // ACIKLAMA: createdAt degiskeninin Turkce karsiligi "created at"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const createdAt =
    normalizeCloudTimestamp(data.createdAt) ||
    normalizeCloudTimestamp(data.addedAt) ||
    updatedAt ||
    String(data.createdAt || data.addedAt || "");
  // ACIKLAMA: transaction degiskeninin Turkce karsiligi "islem"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
    transactionAt: String(data.transactionAt || ""),
    createdAt,
    updatedAt,
  };

  return isValidTransaction(transaction) ? transaction : null;
}

// ACIKLAMA: readCloudTransactionBackupArray fonksiyonunun Turkce karsiligi "oku bulut islem yedekle dizi"; bulut ve yerel veri esitleme akisini yonetir.
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

// ACIKLAMA: getCloudReadyTransactions fonksiyonunun Turkce karsiligi "al bulut hazir islemler"; bulut ve yerel veri esitleme akisini yonetir.
function getCloudReadyTransactions(source) {
  return source.filter((item) => isValidTransaction(item) && !isSampleTransaction(item) && !isTransactionDeleted(item));
}

// ACIKLAMA: getCloudReadyAssets fonksiyonunun Turkce karsiligi "al bulut hazir varliklar"; bulut ve yerel veri esitleme akisini yonetir.
function getCloudReadyAssets(source) {
  return applyDeletedProfileTombstones(readCloudAssets(source), deletedAssetTombstones);
}

// ACIKLAMA: getCloudReadyBesAccounts fonksiyonunun Turkce karsiligi "al bulut hazir BES hesaplar"; bulut ve yerel veri esitleme akisini yonetir.
function getCloudReadyBesAccounts(source) {
  return applyDeletedProfileTombstones(readCloudBesAccounts(source), deletedBesTombstones);
}

// ACIKLAMA: getCloudReadyPaymentAccounts fonksiyonunun Turkce karsiligi "al bulut hazir odeme hesaplar"; bulut ve yerel veri esitleme akisini yonetir.
function getCloudReadyPaymentAccounts(source) {
  return readCloudPaymentAccounts(source);
}

// ACIKLAMA: readCloudAssets fonksiyonunun Turkce karsiligi "oku bulut varliklar"; bulut ve yerel veri esitleme akisini yonetir.
function readCloudAssets(source) {
  return Array.isArray(source) ? source.map(normalizeAsset).filter(Boolean) : [];
}

// ACIKLAMA: readCloudBesAccounts fonksiyonunun Turkce karsiligi "oku bulut BES hesaplar"; bulut ve yerel veri esitleme akisini yonetir.
function readCloudBesAccounts(source) {
  return Array.isArray(source) ? source.map(normalizeBesAccount).filter(Boolean) : [];
}

// ACIKLAMA: readCloudPaymentAccounts fonksiyonunun Turkce karsiligi "oku bulut odeme hesaplar"; bulut ve yerel veri esitleme akisini yonetir.
function readCloudPaymentAccounts(source) {
  return Array.isArray(source) ? source.map(normalizePaymentAccount).filter(Boolean) : [];
}

// ACIKLAMA: normalizeAsset fonksiyonunun Turkce karsiligi "standartlastir varlik"; veriyi uygulamanin bekledigi temiz formata cevirir.
function normalizeAsset(item) {
  if (!item || typeof item.id !== "string" || !assetDefinitions[item.type]) {
    return null;
  }

  // ACIKLAMA: amount degiskeninin Turkce karsiligi "tutar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const amount = Number(item.amount);

  if (!Number.isFinite(amount) || amount < 0) {
    return null;
  }

  // ACIKLAMA: definition degiskeninin Turkce karsiligi "definition"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: normalizeBesAccount fonksiyonunun Turkce karsiligi "standartlastir BES hesap"; veriyi uygulamanin bekledigi temiz formata cevirir.
function normalizeBesAccount(item) {
  if (!item || typeof item.id !== "string") {
    return null;
  }

  // ACIKLAMA: provider degiskeninin Turkce karsiligi "saglayici"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const provider = String(item.provider || "").trim();
  // ACIKLAMA: contribution degiskeninin Turkce karsiligi "contribution"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const contribution = Number(item.contribution || 0);
  // ACIKLAMA: stateContribution degiskeninin Turkce karsiligi "durum contribution"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const stateContribution = Number(item.stateContribution || 0);
  // ACIKLAMA: stateGain degiskeninin Turkce karsiligi "durum gain"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const stateGain = Number(item.stateGain || 0);
  // ACIKLAMA: gain degiskeninin Turkce karsiligi "gain"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: normalizePaymentAccount fonksiyonunun Turkce karsiligi "standartlastir odeme hesap"; veriyi uygulamanin bekledigi temiz formata cevirir.
function normalizePaymentAccount(item) {
  if (!item || typeof item.id !== "string") {
    return null;
  }

  // ACIKLAMA: type degiskeninin Turkce karsiligi "tur"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const type = normalizePaymentAccountType(item.type);
  // ACIKLAMA: name degiskeninin Turkce karsiligi "adi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const name = String(item.name || "").trim();
  // ACIKLAMA: balance degiskeninin Turkce karsiligi "bakiye"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const balance = Number(item.balance || 0);
  // ACIKLAMA: debt degiskeninin Turkce karsiligi "debt"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const debt = Number(item.debt || 0);
  // ACIKLAMA: currentStatementDebt degiskeninin Turkce karsiligi "mevcut statement debt"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const currentStatementDebt = Number(item.currentStatementDebt ?? debt);
  // ACIKLAMA: creditPaidTotal hesaplanan toplam degerin ekranda gosterilecegi alandir.
  const creditPaidTotal = Number(item.creditPaidTotal || 0);
  // ACIKLAMA: currentStatementPaidTotal hesaplanan toplam degerin ekranda gosterilecegi alandir.
  const currentStatementPaidTotal = Number(item.currentStatementPaidTotal || 0);
  // ACIKLAMA: debtBaselineVersion degiskeninin Turkce karsiligi "debt baseline version"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const debtBaselineVersion = Number(item.debtBaselineVersion || 0);
  // ACIKLAMA: limit degiskeninin Turkce karsiligi "limit"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const limit = Number(item.limit || 0);
  // ACIKLAMA: openingBalance degiskeninin Turkce karsiligi "opening bakiye"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const openingBalance = hasStoredMoneyValue(item.openingBalance) ? Number(item.openingBalance) : null;
  // ACIKLAMA: openingDebt degiskeninin Turkce karsiligi "opening debt"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const openingDebt = hasStoredMoneyValue(item.openingDebt) ? Number(item.openingDebt) : null;
  // ACIKLAMA: openingCurrentStatementDebt degiskeninin Turkce karsiligi "opening mevcut statement debt"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: Ayni varlik veya BES kaydi birden fazla cihazda varsa en yeni surumu korur.
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

// ACIKLAMA: mergeRecordsById fonksiyonunun Turkce karsiligi "birlestir kayitlar tarafindan kimlik"; ilgili uygulama islemini calistirir.
function mergeRecordsById(...sources) {
  // ACIKLAMA: merged degiskeninin Turkce karsiligi "merged"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const merged = new Map();

  sources
    .flat()
    .filter((item) => item && typeof item.id === "string")
    .forEach((item) => {
      merged.set(item.id, item);
    });

  return Array.from(merged.values());
}

// ACIKLAMA: normalizeCloudTimestamp fonksiyonunun Turkce karsiligi "standartlastir bulut zaman damgasi"; bulut ve yerel veri esitleme akisini yonetir.
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

// ACIKLAMA: ensureTransactionCreatedAt fonksiyonunun Turkce karsiligi "garanti et islem created at"; kullanilacak veri yapisini veya HTML elemanini olusturur.
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

// ACIKLAMA: normalizeTransactionRecord fonksiyonunun Turkce karsiligi "standartlastir islem kayit"; veriyi uygulamanin bekledigi temiz formata cevirir.
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
    transactionAt: String(item.transactionAt || ""),
    createdAt: ensureTransactionCreatedAt(item),
    updatedAt: normalizeCloudTimestamp(item.updatedAt) || String(item.updatedAt || ""),
  };
}

// ACIKLAMA: getTransactionMergeTimestamp fonksiyonunun Turkce karsiligi "al islem birlestir zaman damgasi"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getTransactionMergeTimestamp(item) {
  return (
    getRecordTimestamp(item?.updatedAt) ||
    getRecordTimestamp(item?.createdAt) ||
    getTransactionSortTimestamp(item) ||
    0
  );
}

// ACIKLAMA: shouldReplaceMergedTransaction fonksiyonunun Turkce karsiligi "mali mi replace merged islem"; ilgili uygulama islemini calistirir.
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

  // ACIKLAMA: existingTime degiskeninin Turkce karsiligi "existing saat"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const existingTime = getTransactionMergeTimestamp(existing);
  // ACIKLAMA: nextTime degiskeninin Turkce karsiligi "sonraki saat"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const nextTime = getTransactionMergeTimestamp(next);

  if (nextTime !== existingTime) {
    return nextTime > existingTime;
  }

  return String(next.id || "") > String(existing.id || "");
}

// ACIKLAMA: mergeTransactions fonksiyonunun Turkce karsiligi "birlestir islemler"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function mergeTransactions(...sources) {
  // ACIKLAMA: byId degiskeninin Turkce karsiligi "tarafindan kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const byId = new Map();

  sources
    .flat()
    .map(normalizeTransactionRecord)
    .filter(Boolean)
    .filter((item) => !isTransactionDeleted(item))
    .forEach((transaction) => {
      // ACIKLAMA: existing degiskeninin Turkce karsiligi "existing"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const existing = byId.get(transaction.id);
      if (shouldReplaceMergedTransaction(existing, transaction)) {
        byId.set(transaction.id, transaction);
      }
    });

  // ACIKLAMA: bySignature degiskeninin Turkce karsiligi "tarafindan imza"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const bySignature = new Map();
  Array.from(byId.values()).forEach((transaction) => {
    // ACIKLAMA: signature degiskeninin Turkce karsiligi "imza"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const signature = getTransactionSignature(transaction);
    // ACIKLAMA: existing degiskeninin Turkce karsiligi "existing"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const existing = bySignature.get(signature);

    if (shouldReplaceMergedTransaction(existing, transaction)) {
      bySignature.set(signature, transaction);
    }
  });

  // ACIKLAMA: records degiskeninin Turkce karsiligi "kayitlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const records = Array.from(bySignature.values());
  return coalesceLegacyTransferPairs(removeLegacyRowsCoveredByTransfers(records)).sort(compareTransactionsNewestFirst);
}

// ACIKLAMA: isTransferLikeRecord fonksiyonunun Turkce karsiligi "mi aktarim benzeri kayit"; ilgili uygulama islemini calistirir.
function isTransferLikeRecord(item) {
  // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: areSameTransactionAmount fonksiyonunun Turkce karsiligi "mi ayni islem tutar"; ilgili uygulama islemini calistirir.
function areSameTransactionAmount(first, second) {
  return Math.abs(Number(first?.amount || 0) - Number(second?.amount || 0)) < 0.01;
}

// ACIKLAMA: getComparableTransactionMinute fonksiyonunun Turkce karsiligi "al comparable islem minute"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getComparableTransactionMinute(item) {
  // ACIKLAMA: time degiskeninin Turkce karsiligi "saat"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const time = getTransactionTime(item);
  return time ? time.slice(0, 5) : "";
}

// ACIKLAMA: haveCompatibleTransferTimes fonksiyonunun Turkce karsiligi "have compatible aktarim times"; ilgili uygulama islemini calistirir.
function haveCompatibleTransferTimes(first, second) {
  // ACIKLAMA: firstMinute degiskeninin Turkce karsiligi "ilk minute"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const firstMinute = getComparableTransactionMinute(first);
  // ACIKLAMA: secondMinute degiskeninin Turkce karsiligi "second minute"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const secondMinute = getComparableTransactionMinute(second);
  return !firstMinute || !secondMinute || firstMinute === secondMinute;
}

// ACIKLAMA: hasSameTransferDayAndAmount fonksiyonunun Turkce karsiligi "var mi ayni aktarim gun and tutar"; ilgili uygulama islemini calistirir.
function hasSameTransferDayAndAmount(first, second) {
  return (
    String(first?.date || "") === String(second?.date || "") &&
    areSameTransactionAmount(first, second) &&
    haveCompatibleTransferTimes(first, second)
  );
}

// ACIKLAMA: isLegacySplitRowForTransfer fonksiyonunun Turkce karsiligi "mi legacy bol satir icin aktarim"; ilgili uygulama islemini calistirir.
function isLegacySplitRowForTransfer(transfer, candidate) {
  if (!transfer || !candidate || transfer.type !== "transfer" || candidate.type === "transfer") {
    return false;
  }

  if (!hasSameTransferDayAndAmount(transfer, candidate)) {
    return false;
  }

  // ACIKLAMA: sourceId degiskeninin Turkce karsiligi "kaynak kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const sourceId = String(transfer.paymentAccountId || "");
  // ACIKLAMA: targetId degiskeninin Turkce karsiligi "hedef kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const targetId = String(transfer.transferAccountId || "");
  // ACIKLAMA: candidateAccountId degiskeninin Turkce karsiligi "candidate hesap kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const candidateAccountId = String(candidate.paymentAccountId || "");

  if (!sourceId || !targetId || !candidateAccountId) {
    return false;
  }

  // ACIKLAMA: isSourceExpense degiskeninin Turkce karsiligi "mi kaynak gider"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const isSourceExpense = candidate.type === "expense" && candidateAccountId === sourceId;
  // ACIKLAMA: isTargetIncome degiskeninin Turkce karsiligi "mi hedef gelir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const isTargetIncome = candidate.type === "income" && candidateAccountId === targetId;

  return (isSourceExpense || isTargetIncome) && isTransferLikeRecord(candidate);
}

// ACIKLAMA: removeLegacyRowsCoveredByTransfers fonksiyonunun Turkce karsiligi "kaldir legacy satirlar kapsanmis tarafindan transfers"; secilen kaydi siler veya listeden kaldirir.
function removeLegacyRowsCoveredByTransfers(source = []) {
  // ACIKLAMA: transfers degiskeninin Turkce karsiligi "transfers"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: isLikelySplitTransferPair fonksiyonunun Turkce karsiligi "mi olasi bol aktarim pair"; AI destekli okuma veya API istegi akisini calistirir.
function isLikelySplitTransferPair(first, second) {
  if (!first || !second || first.type === second.type || first.type === "transfer" || second.type === "transfer") {
    return false;
  }

  if (!hasSameTransferDayAndAmount(first, second)) {
    return false;
  }

  // ACIKLAMA: firstAccountId degiskeninin Turkce karsiligi "ilk hesap kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const firstAccountId = String(first.paymentAccountId || "");
  // ACIKLAMA: secondAccountId degiskeninin Turkce karsiligi "second hesap kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const secondAccountId = String(second.paymentAccountId || "");

  if (!firstAccountId || !secondAccountId || firstAccountId === secondAccountId) {
    return false;
  }

  return isTransferLikeRecord(first) || isTransferLikeRecord(second);
}

// ACIKLAMA: getTransactionPairScore fonksiyonunun Turkce karsiligi "al islem pair puan"; AI destekli okuma veya API istegi akisini calistirir.
function getTransactionPairScore(first, second) {
  // ACIKLAMA: score degiskeninin Turkce karsiligi "puan"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: buildTransferFromSplitPair fonksiyonunun Turkce karsiligi "olustur aktarim kaynakli bol pair"; AI destekli okuma veya API istegi akisini calistirir.
function buildTransferFromSplitPair(first, second) {
  // ACIKLAMA: expense degiskeninin Turkce karsiligi "gider"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const expense = first.type === "expense" ? first : second;
  // ACIKLAMA: income degiskeninin Turkce karsiligi "gelir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const income = first.type === "income" ? first : second;
  // ACIKLAMA: updatedAt degiskeninin Turkce karsiligi "updated at"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const updatedAt = [expense.updatedAt, income.updatedAt]
    .filter(Boolean)
    .sort((left, right) => getRecordTimestamp(right) - getRecordTimestamp(left))[0] || getTurkeyNowDateTime();
  // ACIKLAMA: createdAt degiskeninin Turkce karsiligi "created at"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const createdAt = [expense.createdAt, income.createdAt].filter(Boolean).sort()[0] || expense.createdAt || income.createdAt || updatedAt;
  // ACIKLAMA: notes degiskeninin Turkce karsiligi "notes"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const notes = [expense.note, income.note].map((value) => String(value || "").trim()).filter(Boolean);
  // ACIKLAMA: uniqueNotes degiskeninin Turkce karsiligi "unique notes"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: coalesceLegacyTransferPairs fonksiyonunun Turkce karsiligi "bir araya getir legacy aktarim pairs"; AI destekli okuma veya API istegi akisini calistirir.
function coalesceLegacyTransferPairs(source = []) {
  // ACIKLAMA: records degiskeninin Turkce karsiligi "kayitlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const records = [...source];
  // ACIKLAMA: usedIds degiskeninin Turkce karsiligi "used kimlikler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const usedIds = new Set();
  // ACIKLAMA: result degiskeninin Turkce karsiligi "result"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const result = [];

  records.forEach((item) => {
    if (usedIds.has(item.id)) {
      return;
    }

    if (item.type !== "expense") {
      return;
    }

    // ACIKLAMA: candidates degiskeninin Turkce karsiligi "aday metinler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const candidates = records
      .filter((candidate) => !usedIds.has(candidate.id) && candidate.id !== item.id && candidate.type === "income")
      .filter((candidate) => isLikelySplitTransferPair(item, candidate))
      .sort((first, second) => getTransactionPairScore(item, second) - getTransactionPairScore(item, first));

    if (!candidates.length) {
      return;
    }

    // ACIKLAMA: income degiskeninin Turkce karsiligi "gelir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: getLegacyTransferCounterpartIds fonksiyonunun Turkce karsiligi "al legacy aktarim counterpart kimlikler"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getLegacyTransferCounterpartIds(transfer, previousTransaction = null) {
  // ACIKLAMA: ids degiskeninin Turkce karsiligi "kimlikler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
      // ACIKLAMA: previousWasSourceExpense degiskeninin Turkce karsiligi "previous was kaynak gider"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const previousWasSourceExpense = previousTransaction.type === "expense";
      // ACIKLAMA: candidateIsTargetIncome degiskeninin Turkce karsiligi "candidate mi hedef gelir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const candidateIsTargetIncome = candidate.type === "income" && String(candidate.paymentAccountId || "") === String(transfer.transferAccountId || "");
      // ACIKLAMA: previousWasTargetIncome degiskeninin Turkce karsiligi "previous was hedef gelir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const previousWasTargetIncome = previousTransaction.type === "income";
      // ACIKLAMA: candidateIsSourceExpense degiskeninin Turkce karsiligi "candidate mi kaynak gider"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const candidateIsSourceExpense = candidate.type === "expense" && String(candidate.paymentAccountId || "") === String(transfer.paymentAccountId || "");

      if ((previousWasSourceExpense && candidateIsTargetIncome) || (previousWasTargetIncome && candidateIsSourceExpense)) {
        ids.add(candidate.id);
      }
    }
  });

  return ids;
}

// ACIKLAMA: isSampleTransaction fonksiyonunun Turkce karsiligi "mi sample islem"; ilgili uygulama islemini calistirir.
function isSampleTransaction(item) {
  return ["Nisan Maaşı", "Haftalık Market", "Elektrik Faturası"].includes(item.title);
}

// ACIKLAMA: getFirebaseErrorMessage fonksiyonunun Turkce karsiligi "al Firebase hata mesaj"; Firebase veya kimlik dogrulama islemlerini yonetir.
function getFirebaseErrorMessage(error) {
  // ACIKLAMA: code degiskeninin Turkce karsiligi "code"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
