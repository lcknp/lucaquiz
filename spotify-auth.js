// spotify-auth.js (PKCE, ohne Client Secret, geeignet für GitHub Pages)
// Token wird in localStorage gespeichert.

const SpotifyAuth = (() => {
  const CLIENT_ID = "HIER_DEINE_SPOTIFY_CLIENT_ID_EINFUEGEN";
  const REDIRECT_URI = new URL("spotify-callback.html", location.href).toString();

  const TOKEN_KEY = "spotify_access_token_v1";
  const EXP_KEY = "spotify_access_token_exp_v1";
  const VERIFIER_KEY = "spotify_pkce_verifier_v1";

  function nowSec() { return Math.floor(Date.now() / 1000); }

  function getToken() {
    const t = localStorage.getItem(TOKEN_KEY);
    const exp = Number(localStorage.getItem(EXP_KEY) || "0");
    if (!t || !exp) return null;
    if (nowSec() >= exp - 30) return null; // 30s Puffer
    return t;
  }

  async function sha256(plain) {
    const enc = new TextEncoder().encode(plain);
    const digest = await crypto.subtle.digest("SHA-256", enc);
    return new Uint8Array(digest);
  }

  function base64url(bytes) {
    let str = "";
    bytes.forEach(b => str += String.fromCharCode(b));
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  function randomString(len = 64) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~";
    const arr = crypto.getRandomValues(new Uint8Array(len));
    return Array.from(arr, x => chars[x % chars.length]).join("");
  }

  async function createCodeChallenge(verifier) {
    const hashed = await sha256(verifier);
    return base64url(hashed);
  }

  async function login(returnTo) {
    if (!CLIENT_ID || CLIENT_ID.includes("HIER_DEINE")) {
      alert("Bitte in spotify-auth.js deine Spotify CLIENT_ID eintragen.");
      return;
    }

    sessionStorage.setItem("spotify_return_to", returnTo || "index.html");

    const verifier = randomString(64);
    localStorage.setItem(VERIFIER_KEY, verifier);

    const challenge = await createCodeChallenge(verifier);

    const params = new URLSearchParams({
      response_type: "code",
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      code_challenge_method: "S256",
      code_challenge: challenge,
      // Keine Scopes nötig für Search/Tracks Preview (öffentliche Daten)
      // scope: ""
    });

    location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  async function handleRedirectCallback() {
    const url = new URL(location.href);
    const code = url.searchParams.get("code");
    const err = url.searchParams.get("error");
    if (err) throw new Error(err);
    if (!code) throw new Error("Kein code in Callback URL.");

    const verifier = localStorage.getItem(VERIFIER_KEY);
    if (!verifier) throw new Error("Kein PKCE verifier gefunden.");

    const body = new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: verifier
    });

    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });

    if (!res.ok) {
      const t = await res.text();
      throw new Error("Token Fehler: " + t);
    }

    const data = await res.json();
    const accessToken = data.access_token;
    const expiresIn = data.expires_in; // Sekunden

    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(EXP_KEY, String(nowSec() + Number(expiresIn || 3600)));
    localStorage.removeItem(VERIFIER_KEY);

    // URL cleanen
    url.searchParams.delete("code");
    url.searchParams.delete("state");
    history.replaceState({}, "", url.toString());
  }

  async function api(path) {
    const token = getToken();
    if (!token) throw new Error("NOT_LOGGED_IN");
    const res = await fetch(`https://api.spotify.com/v1${path}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.status === 401) throw new Error("TOKEN_EXPIRED");
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  return { login, handleRedirectCallback, getToken, api };
})();
