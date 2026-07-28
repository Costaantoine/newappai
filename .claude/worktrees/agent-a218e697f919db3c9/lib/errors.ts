export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class AuthError extends ApiError {
  constructor(message: string = 'Non authentifié') {
    super(401, message, 'AUTH_ERROR')
    this.name = 'AuthError'
  }
}

export class ValidationError extends ApiError {
  constructor(message: string = 'Données invalides') {
    super(400, message, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Ressource non trouvée') {
    super(404, message, 'NOT_FOUND')
    this.name = 'NotFoundError'
  }
}

export class StripeError extends ApiError {
  constructor(message: string = 'Erreur de paiement') {
    super(402, message, 'STRIPE_ERROR')
    this.name = 'StripeError'
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string = 'Trop de requêtes') {
    super(429, message, 'RATE_LIMIT')
    this.name = 'RateLimitError'
  }
}
