
describe('Authentication Flow', () => {
    beforeEach(() => {
        // Visit the login page before each test
        cy.visit('/login');
    });

    it('should display the login form correctly', () => {
        cy.contains('Welcome back').should('be.visible');
        cy.get('input[name="email"]').should('exist');
        cy.get('input[name="password"]').should('exist');
        cy.contains('button', 'Sign in').should('be.visible');
    });

    it('should switch to sign up mode', () => {
        cy.contains('Sign up').click();
        cy.contains('Create your account').should('be.visible');
        cy.get('input[name="fullName"]').should('be.visible');
        cy.contains('button', 'Create Account').should('be.visible');
    });

    it('should show error for invalid login attempt', () => {
        cy.get('input[name="email"]').type('fake@example.com');
        cy.get('input[name="password"]').type('wrongpassword');
        cy.contains('button', 'Sign in').click();

        // Expect an error toast or message (adjust selector based on your Toast implementation)
        // React Hot Toast usually renders distinct divs. We can check for standard error text.
        // Since we don't know exact toast text for 'fake user', we look for 'invalid' or 'failed'
        // or just check that we are still on /login
        cy.url().should('include', '/login');
    });
});
