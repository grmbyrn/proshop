const MIN_PASSWORD_LENGTH = 8

const isNonEmptyString = (value: unknown): value is string => {
    return typeof value === 'string' && value.trim().length > 0
}

const isValidEmail = (value: unknown): value is string => {
    return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

const isValidPassword = (value: unknown): value is string => {
    return typeof value === 'string' && value.length >= MIN_PASSWORD_LENGTH
}

// Escape user input before putting it in a $regex, so it's matched as plain text
const escapeRegex = (value: string) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export { MIN_PASSWORD_LENGTH, isNonEmptyString, isValidEmail, isValidPassword, escapeRegex }
