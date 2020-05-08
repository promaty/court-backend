import BaseValidator from './BaseValidator'
import { User } from '../models/objection'
import { isTokenValid } from '../helpers/token-manager'

class UserEmailVerificationTokenValidator extends BaseValidator {
  async validateForVerify({ address, token }) {
    await this._validateAddressFormat(address)  // need to check address since this is an unauthenticated endpoint
    if (!this.errors.length) {
      await this._validateEmailNotVerified(address)
    }
    if (!this.errors.length) {
      await this._validateTokenFormat({address, token})
    }
    return this.resetErrors()
  }

  async validateForResend({ address }) {
    await this._validateEmailNotVerified(address)
    return this.resetErrors()
  }

  async _validateTokenFormat({ address, token }) {
    const user = await User.query().findOne({address}).withGraphFetched('emailVerificationToken')
    if (!user) {
      return this.addError({address: `User ${address} not found`})
    }
    if (!token) {
      return this.addError({token: 'A token must be given'})
    }
    if (token != user?.emailVerificationToken?.token) {
      return this.addError({token: 'Given token is invalid'})
    }
    if (user.emailVerificationToken.expiresAt < new Date()) {
      return this.addError({token: 'Given token has expired'})
    }
    if (!isTokenValid(token)) {
      this.addError({token: 'Given token is invalid'})
    }
  }
  
  async _validateEmailNotVerified(address) {
    const user = await User.query().findOne({address}).withGraphFetched('email')
    if (user?.emailVerified) {
      return this.addError({email: 'Email is already verified'})
    }
    if (!user?.email) {
      this.addError({email: 'No associated email found'})
    }
  }
}

export default new UserEmailVerificationTokenValidator()
