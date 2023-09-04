describe('TFL single fare finder', () => {

  beforeEach(() => {
    Cypress.on('uncaught:exception', (err) => false);
    cy.visit('https://tfl.gov.uk/fares/find-fares/tube-and-rail-fares/single-fare-finder');
    cy.get('[class="cb-button cb-right"]').click();  // accept cookies
  });

  const selectStartStation = (station) => {
    cy.get('#From').type(station);
    cy.get('#stop-points-search-from-suggestion-0').click({force: true});
  }

  const selectEndStation = (station) => {
    cy.get('#To').type(station);
    cy.get('#stop-points-search-to-suggestion-0').click({force: true});
  }

  it('should default to Adult fare type', () => {

    cy.get('#PassengerType').scrollIntoView();

    cy.get('select#PassengerType option:selected').should(
      'have.text',
      'Adult',
    );
  });

  it('should return an error message when the same start and end station is selected', () => {

    selectStartStation('waterloo');
    selectEndStation('waterloo');
    cy.get('#submit').click();

    cy.get('.field-validation-error').contains('No fares found, please try again');
  });

  it('should display a table with the correct fares from Heathrow Terminal 5 to Oxford Circus', () => {

    selectStartStation('terminal 5');
    selectEndStation('oxford');

    cy.get('#submit')
      .contains('Show single fares')
      .click();

    cy.get('.dashed-table').should('be.visible');

    cy.get('.row')
      .eq(0)
      .should('contain', 'Oyster')
      .and('contain', 'Contactless')
      .and('contain', '£5.60');

    cy.get('.row')
      .eq(1)
      .should('contain', 'Cash')
      .and('contain', '£6.70');
  });
});



/*
Notes:

TFL was a slightly awkward site to write tests for :) It doesn't use data test ids which is why I had to make use of the class and ids. This isn't ideal as classes and ids are more likely to change than dedicated test ids.

Next steps:
- The cookie modal: In this case I'm choosing to accept cookies as a user would. However, visiting the site and accepting cookies before each test isn't a true user test. Cypress used to have a preserve cookies function which has been deprecated as of v10. In the interest of time I chose to visit the site and accept the cookies before each test - this could be improved by preserving/setting cookies.
- Using force:true isn't a best practice in cypress, the reason I've used this here is because Cypress can be too fast for its own good at times. Sometimes the suggested station wasn't rendering quick enough, causing the test to fail. 
- Testing the separate fares was a bit of a pain as it wasn't actually a table, just some divs and no unique selectors for Oyster/Contactless and Cash. If I was to write a better test for this, both Oyster/Contactless and Cash rows would need unique ids. 
- Could have made more assertions but chose to stay within task. If I was testing this app I would ensure to add coverage on other important parts such as the headings, url etc
- Hide xhr requests: Some of the fetch/xhr requests create a lot of noise in the test runner, config can be added to hide these.

*/