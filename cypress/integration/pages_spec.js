describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('http://localhost:3000')
  })
})
describe('The Signup Page', () => {
  it('successfully loads', () => {
    cy.visit('/auth/signup')
  })
})
describe('The Login Page', () => {
  it('successfully loads', () => {
    cy.visit('/auth/login')
  })
})
describe('The main Page without Auth', () => {
  it('successfully loads', () => {
    cy.request({
      url: '/vacancies',
      followRedirect: false
    })
      .then((resp) => {
        expect(resp.status).to.eq(302)
        expect(resp.redirectedToUrl).to.eq('http://localhost:3000/auth/login')
      })
  })
})