import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'

export default class RoleMiddleware {
  async handle(ctx: HttpContext, next: NextFn, guards: string[]) {
    try {
      await ctx.auth.authenticate()
      
      const user = ctx.auth.user!
      const requiredRoles = guards.length > 0 ? guards : ['admin']
      
      if (!requiredRoles.includes(user.role)) {
        return ctx.response.status(403).json({
          success: false,
          message: 'Accès refusé. Permissions insuffisantes.'
        })
      }
      
      return next()
    } catch (error) {
      return ctx.response.status(401).json({
        success: false,
        message: 'Token d\'authentification invalide ou manquant'
      })
    }
  }
} 