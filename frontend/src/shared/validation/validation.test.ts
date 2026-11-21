import { describe, expect, it } from 'vitest'
import { validateField, validateFields } from './validateField'
describe('shared field validation', () => {
 it('validates names', () => { expect(validateField('personName','Ali Sönmez').valid).toBe(true); expect(validateField('personName','Ali😊').valid).toBe(false) })
 it('validates email', () => { expect(validateField('email','a@example.com').valid).toBe(true); expect(validateField('email','bad').valid).toBe(false) })
 it('validates phone', () => { expect(validateField('phone','5551234567',{countryCode:'+90'}).valid).toBe(true); expect(validateField('phone','4551234567',{countryCode:'+90'}).valid).toBe(false) })
 it('validates bounds', () => { expect(validateField('positiveInteger',0).code).toBe('below_minimum'); expect(validateField('nonNegativeInteger',3,{max:2}).code).toBe('above_maximum') })
 it('validates reference and localization', () => { expect(validateField('bookingReference','1042').valid).toBe(true); expect(validateField('bookingReference','bad').valid).toBe(false); expect(validateField('email','bad',{},'de').message).toContain('E-Mail') })
 it('collects errors', () => { const errors=validateFields({name:'Ali1',email:'a@example.com'},{name:{kind:'personName'},email:{kind:'email'}}); expect(errors.name?.code).toBe('invalid_name'); expect(errors.email).toBeUndefined() })
})
