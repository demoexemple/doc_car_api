import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'
import { DateTime } from 'luxon'

interface RateLimitConfig {
  maxAttempts: number
  windowMs: number
  keyGenerator?: (ctx: HttpContext) => string
}

export default class RateLimitMiddleware {
  private attempts = new Map<string, { count: number; resetTime: DateTime }>()

  async handle(ctx: HttpContext, next: NextFn, config: RateLimitConfig = {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    keyGenerator: (ctx) => ctx.request.ip()
  }) {
    const key = config.keyGenerator!(ctx)
    const now = DateTime.now()
    
    // Nettoyer les anciennes tentatives
    this.cleanupOldAttempts(now)
    
    // Vérifier les tentatives actuelles
    const attempt = this.attempts.get(key)
    
    if (attempt) {
      if (now < attempt.resetTime) {
        if (attempt.count >= config.maxAttempts) {
          const remainingTime = attempt.resetTime.diff(now, 'seconds').seconds
          
          return ctx.response.status(429).json({
            success: false,
            message: `Trop de tentatives. Réessayez dans ${Math.ceil(remainingTime)} secondes.`,
            retryAfter: Math.ceil(remainingTime)
          })
        }
        
        attempt.count++
      } else {
        // Réinitialiser le compteur si la fenêtre de temps est expirée
        this.attempts.set(key, {
          count: 1,
          resetTime: now.plus({ milliseconds: config.windowMs })
        })
      }
    } else {
      // Première tentative
      this.attempts.set(key, {
        count: 1,
        resetTime: now.plus({ milliseconds: config.windowMs })
      })
    }
    
    return next()
  }

  private cleanupOldAttempts(now: DateTime) {
    for (const [key, attempt] of this.attempts.entries()) {
      if (now >= attempt.resetTime) {
        this.attempts.delete(key)
      }
    }
  }
} 