import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */
  redirectTo = '/login'

  async handle(ctx: HttpContext, next: NextFn) {
    try {
      await ctx.auth.authenticate()
      return next()
    } catch (error) {
      return ctx.response.status(401).json({
        success: false,
        message: 'Token d\'authentification invalide ou manquant'
      })
    }
  }
}