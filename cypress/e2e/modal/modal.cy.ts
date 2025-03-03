import { INGREDIENT_LINK, MODAL } from '../../support/selectors';

describe('Modal', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.intercept('GET', '/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
  });

  it('Проверка открытия и закрытия модального окна ингредиента', () => {
    cy.wait('@getIngredients');
    cy.get(INGREDIENT_LINK)
      .filter(':contains("Краторная булка N-200i")')
      .find('a')
      .click();
    cy.get(MODAL).should('be.visible');
    cy.get(MODAL).should('contain', 'Краторная булка N-200i');
    cy.get(MODAL).find('button').click();
    cy.get(MODAL).should('not.exist');

    cy.get(INGREDIENT_LINK)
      .filter(':contains("Краторная булка N-200i")')
      .find('a')
      .click();
    cy.get(MODAL).should('be.visible');
    cy.get(MODAL).should('contain', 'Краторная булка N-200i');
    cy.get('[data-cy="modal-overlay"]').click(15, 15, { force: true });
    cy.get(MODAL).should('not.exist');
  });
});
