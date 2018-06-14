import * as NEP2 from '../../../src/wallet/nep2'
import { isNEP2, isWIF } from '../../../src/wallet/verify'
import testKeys from '../testKeys.json'

describe('NEP2', function () {
  const simpleScrypt = {
    n: 256,
    r: 1,
    p: 1
  }

  describe('Basic (NEP2)', function () {
    this.timeout(0)
    let encrypted
    it('encrypt', async () => {
      encrypted = await NEP2.encrypt(testKeys.a.wif, testKeys.a.passphrase)
      isNEP2(encrypted).should.equal(true)
      encrypted.should.equal(testKeys.a.encryptedWif)
    })

    it('decrypt', async () => {
      const wif = await NEP2.decrypt(encrypted, testKeys.a.passphrase)
      isWIF(wif).should.equal(true)
      wif.should.equal(testKeys.a.wif)
    })
  })

  describe('Non-english', function () {
    let asyncEncrypted
    const passphrase = testKeys.b.passphrase

    it('encrypt', async () => {
      const encryptedKey = await NEP2.encrypt(testKeys.a.wif, passphrase, simpleScrypt)
      asyncEncrypted = encryptedKey
      return isNEP2(asyncEncrypted).should.equal(true)
    })
    it('decrypt', async () => {
      const wif = await NEP2.decrypt(asyncEncrypted, passphrase, simpleScrypt)
      isWIF(wif).should.equal(true)
      return wif.should.equal(testKeys.a.wif)
    })
  })

  describe('Symbols', function () {
    let encrypted
    let asyncEncrypted
    const passphrase = testKeys.c.passphrase

    it('encrypt', async () => {
      const encryptedKey = await NEP2.encrypt(testKeys.a.wif, passphrase, simpleScrypt)
      asyncEncrypted = encryptedKey
      return isNEP2(asyncEncrypted).should.equal(true)
    })

    it('decrypt', async () => {
      const wif = await NEP2.decrypt(asyncEncrypted, passphrase, simpleScrypt)
      isWIF(wif).should.equal(true)
      return wif.should.equal(testKeys.a.wif)
    })
  })

  describe('Error', function () {
    it('Errors on wrong password', () => {
      const thrower = NEP2.decrypt(testKeys.a.encryptedWif, 'wrongpassword', simpleScrypt)
      return thrower.should.be.rejectedWith(Error, 'Wrong Password')
    })

    it('Errors on wrong scrypt params', () => {
      const thrower = NEP2.decrypt(testKeys.a.encryptedWif, testKeys.a.passphrase, simpleScrypt)
      return thrower.should.be.rejectedWith(Error, `scrypt parameters`)
    })
  })
})