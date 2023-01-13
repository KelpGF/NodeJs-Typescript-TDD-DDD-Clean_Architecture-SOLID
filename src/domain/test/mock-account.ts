import { AccountModel } from '@/domain/models/account'
import { AddAccountParams } from '@/domain/usecases/account/add-account'
import { AuthenticationParams } from '@/domain/usecases/account/authentication'

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: 'any_account_email@mail.com',
  password: 'any_account_password'
})
export const mockAddAccountParams = (): AddAccountParams => Object.assign({}, mockAuthenticationParams(), { name: 'any_account_name' })
export const mockAddAccountParamsWithToken = (): AddAccountParams => Object.assign({}, mockAddAccountParams(), { accessToken: 'any_token' })
export const mockAddAccountParamsWithTokenAndRole = (role?: string): AddAccountParams => Object.assign({}, mockAddAccountParamsWithToken(), { role })
export const mockAccountModel = (): AccountModel => Object.assign({}, mockAddAccountParams(), { id: 'any_account_id' })
