import { SettingsStore } from '../src/stylestore.js'
import assert from 'assert'

describe('SettingsStore', () => {
  const store = new SettingsStore()

	it('#get should return access token from local storage', () => {
		window.localStorage.setItem('maputnik:access_token', 'OLD_TOKEN')
		assert.equal(store.accessToken, 'OLD_TOKEN')
	})

	it('#set should set access token in local storage', () => {
		store.accessToken = 'NEW_TOKEN'
		assert.equal(window.localStorage.getItem('maputnik:access_token'), 'NEW_TOKEN')
	})
})
