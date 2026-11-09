const DB_NAME = 'study-larping'
const DB_VERSION = 1
const STORE_NAME = 'attachments'

type StoredAttachment = {
  id: string
  blob: Blob
  name: string
  type: string
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not available in this browser.'))
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () =>
      reject(request.error ?? new Error('Could not open the attachment store.'))
  })
}

/**
 * Keeps the raw file so the viewer can open it in a *new tab* — object URLs die
 * with the document that created them. Swap for real uploads once the API exists.
 */
export async function saveAttachmentFile(id: string, file: File): Promise<void> {
  const database = await openDatabase()

  try {
    const record: StoredAttachment = { id, blob: file, name: file.name, type: file.type }

    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, 'readwrite')
      transaction.objectStore(STORE_NAME).put(record)
      transaction.oncomplete = () => resolve()
      transaction.onerror = () =>
        reject(transaction.error ?? new Error('Could not store the attachment.'))
    })
  } finally {
    database.close()
  }
}

export async function readAttachmentFile(id: string): Promise<Blob | null> {
  const database = await openDatabase()

  try {
    return await new Promise<Blob | null>((resolve, reject) => {
      const request = database.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(id)

      request.onsuccess = () => {
        const record = request.result as StoredAttachment | undefined
        resolve(record?.blob ?? null)
      }

      request.onerror = () => reject(request.error ?? new Error('Could not read the attachment.'))
    })
  } finally {
    database.close()
  }
}
