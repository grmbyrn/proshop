// Turns an RTK Query error (or any thrown value) into a readable message
export const getErrorMessage = (error: unknown): string => {
    if (typeof error === 'object' && error !== null) {
        if ('data' in error) {
            const data = error.data
            if (typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string') {
                return data.message
            }
        }
        if ('error' in error && typeof error.error === 'string') {
            return error.error
        }
        if ('message' in error && typeof error.message === 'string') {
            return error.message
        }
    }
    return 'Something went wrong'
}
