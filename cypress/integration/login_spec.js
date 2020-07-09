describe('The Signup Page', () => {
  it('sets auth cookie when logging in via form submission', function () {
    // destructuring assignment of the this.currentUser object
    const username = "usertest"
    const password = "12345678"
    const email = "test@gmail.com"


    cy.visit('/auth/login')

    cy.get('input[name=username]').type(username)

    // {enter} causes the form to submit
    cy.get('input[name=password]').type(`${password}{enter}`)

    // we should be redirected to /dashboard
    cy.url().should('include', '/vacancies')

    // our auth cookie should be present

    // UI should reflect this user being logged in
    cy.get('h2').should('contain', username)
  })
})
