// Biometric Authentication using WebAuthn API (Touch ID, Face ID, Windows Hello)

export interface BiometricCredential {
  id: string;
  publicKey: string;
  counter: number;
  createdAt: string;
}

/**
 * Check if biometric authentication is available on this device
 */
export function isBiometricAvailable(): boolean {
  if (typeof window === 'undefined') return false;

  // Check if WebAuthn is supported
  return !!(
    window.PublicKeyCredential &&
    navigator.credentials &&
    navigator.credentials.create
  );
}

/**
 * Get user-friendly name for the platform authenticator
 */
export function getBiometricType(): string {
  if (typeof window === 'undefined') return 'Biometric';

  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes('mac') || userAgent.includes('iphone') || userAgent.includes('ipad')) {
    return 'Touch ID / Face ID';
  } else if (userAgent.includes('windows')) {
    return 'Windows Hello';
  } else if (userAgent.includes('android')) {
    return 'Fingerprint';
  }

  return 'Biometric Authentication';
}

/**
 * Register biometric authentication for the current user
 */
export async function registerBiometric(userId: string, userName: string, userEmail: string): Promise<{ success: boolean; error?: string; credential?: any }> {
  try {
    if (!isBiometricAvailable()) {
      return { success: false, error: 'Biometric authentication is not available on this device' };
    }

    // Generate a challenge (in production, get this from your server)
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    // Create credential options
    const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: 'A-Frame Cabins',
        id: window.location.hostname,
      },
      user: {
        id: Uint8Array.from(userId, c => c.charCodeAt(0)),
        name: userEmail,
        displayName: userName,
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' },  // ES256
        { alg: -257, type: 'public-key' } // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform', // Platform authenticator (Touch ID, Face ID, Windows Hello)
        requireResidentKey: false,
        userVerification: 'required',
      },
      timeout: 60000,
      attestation: 'none',
    };

    // Create the credential
    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    }) as PublicKeyCredential;

    if (!credential) {
      return { success: false, error: 'Failed to create biometric credential' };
    }

    // Extract credential data
    const response = credential.response as AuthenticatorAttestationResponse;
    const credentialId = Array.from(new Uint8Array(credential.rawId))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const publicKey = Array.from(new Uint8Array(response.getPublicKey()!))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Store credential in localStorage (in production, send to server)
    const biometricData: BiometricCredential = {
      id: credentialId,
      publicKey,
      counter: 0,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(`biometric_${userId}`, JSON.stringify(biometricData));

    return { success: true, credential: biometricData };
  } catch (error: any) {
    console.error('Biometric registration error:', error);

    if (error.name === 'NotAllowedError') {
      return { success: false, error: 'Biometric authentication was cancelled or not allowed' };
    } else if (error.name === 'InvalidStateError') {
      return { success: false, error: 'This device has already been registered' };
    }

    return { success: false, error: 'Failed to register biometric authentication' };
  }
}

/**
 * Authenticate using biometric authentication
 */
export async function authenticateBiometric(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isBiometricAvailable()) {
      return { success: false, error: 'Biometric authentication is not available' };
    }

    // Get stored credential
    const storedCredential = localStorage.getItem(`biometric_${userId}`);
    if (!storedCredential) {
      return { success: false, error: 'No biometric credential found. Please register first.' };
    }

    const credential: BiometricCredential = JSON.parse(storedCredential);

    // Generate challenge
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    // Convert credential ID from hex string to Uint8Array
    const credentialIdBytes = new Uint8Array(
      credential.id.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
    );

    // Create authentication options
    const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
      challenge,
      allowCredentials: [{
        id: credentialIdBytes,
        type: 'public-key',
        transports: ['internal'],
      }],
      timeout: 60000,
      userVerification: 'required',
    };

    // Authenticate
    const assertion = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    }) as PublicKeyCredential;

    if (!assertion) {
      return { success: false, error: 'Biometric authentication failed' };
    }

    // In production, verify the assertion on the server
    // For now, we just check if we got a valid assertion
    return { success: true };
  } catch (error: any) {
    console.error('Biometric authentication error:', error);

    if (error.name === 'NotAllowedError') {
      return { success: false, error: 'Biometric authentication was cancelled' };
    }

    return { success: false, error: 'Biometric authentication failed' };
  }
}

/**
 * Check if biometric is registered for a user
 */
export function isBiometricRegistered(userId: string): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(`biometric_${userId}`) !== null;
}

/**
 * Remove biometric credential for a user
 */
export function removeBiometric(userId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`biometric_${userId}`);
}

/**
 * Get all registered biometric credentials (for debugging)
 */
export function getAllBiometricCredentials(): BiometricCredential[] {
  if (typeof window === 'undefined') return [];

  const credentials: BiometricCredential[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('biometric_')) {
      try {
        const credential = JSON.parse(localStorage.getItem(key)!);
        credentials.push(credential);
      } catch (e) {
        // Skip invalid entries
      }
    }
  }

  return credentials;
}
