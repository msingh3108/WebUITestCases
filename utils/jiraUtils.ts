import * as fs from 'fs';

const XRAY_AUTH_URL = 'https://xray.cloud.getxray.app/api/v2/authenticate';
const XRAY_IMPORT_URL = 'https://xray.cloud.getxray.app/api/v2/import/execution';

/**
 * Authenticates with Xray and returns a bearer token.
 * @param clientId     Xray client ID
 * @param clientSecret Xray client secret
 */
export async function getBearerToken(clientId: string, clientSecret: string): Promise<string> {
  console.log('getting token');

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
  });

  const response = await fetch(XRAY_AUTH_URL, {
    method: 'POST',
    body,
  });

  if (!response.ok) {
     const errText = await response.text().catch(() => '');
     throw new Error(
       `Xray auth failed: ${response.status} ${response.statusText}${errText ? ` - ${errText}` : ''}`
     );
   }

  const xAccessToken = response.headers.get('x-access-token');
  if (xAccessToken) {
    return xAccessToken;
  }

  // Fallback: token may be in the response body as a JSON string
  const text = await response.text();
   const token = text.replace(/^"|"$/g, '');
   if (!token) {
     throw new Error('Xray auth succeeded but no token was returned.');
   }
   return token;
}

/**
 * Updates a single test's status inside a Xray test execution.
 * @param token            Bearer token from getBearerToken
 * @param testExecutionKey Jira test execution issue key, e.g. 'HRA-8420'
 * @param testKey          Jira test issue key, e.g. 'HRA-6926'
 * @param status           Playwright test status
 */
export async function updateTestInExecution(
  token: string,
  testExecutionKey: string,
  testKey: string,
  status: 'passed' | 'failed' | 'skipped' | 'timedOut' | 'interrupted'
): Promise<void> {
  const statusMap: Record<string, string> = {
    passed: 'PASSED',
    failed: 'FAILED',
    skipped: 'ABORTED',
    timedOut: 'FAILED',
    interrupted: 'ABORTED',
  };

  const payload = {
    testExecutionKey,
    tests: [{ testKey, status: statusMap[status] ?? 'TODO' }],
  };

  const res = await fetch(XRAY_IMPORT_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error(`[Xray] Failed to update ${testKey} in ${testExecutionKey}: ${res.status} ${res.statusText}`);
  } else {
    console.log(`[Xray] ${testKey} marked as ${statusMap[status]} in ${testExecutionKey}`);
  }
}

/**
 * Imports a test execution JSON file into Xray.
 * @param token        Bearer token from getBearerToken
 * @param jsonFilePath Absolute path to the Xray JSON results file
 */
export async function importExecutionResults(token: string, jsonFilePath: string): Promise<string> {
  console.log('xray import');

  const jsonContent = fs.readFileSync(jsonFilePath, 'utf-8');

  const response = await fetch(XRAY_IMPORT_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: jsonContent,
  });

  if (!response.ok) {
    throw new Error(`Xray import failed: ${response.status} ${response.statusText}`);
  }

  const responseContent = await response.text();
  console.log(responseContent);
  return responseContent;
}
