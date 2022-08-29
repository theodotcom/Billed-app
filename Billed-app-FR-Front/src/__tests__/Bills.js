/**
 * @jest-environment jsdom
 */

 import { 
  getByTestId,
  getAllByTestId,
  getAllByAltText,
  getByRole,
  toHaveClass
 } from '@testing-library/dom'
 import userEvent from '@testing-library/user-event'


import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import Bills from '../containers/Bills.js';

import { ROUTES_PATH, ROUTES} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import store from '../app/Store.js';

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon.classList.contains('active-icon')).toBeTruthy();

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
})




 // handleClickIconEye for container/Bills.js
 describe('When I click on the icon eye', () => {
  test('A modal should open', () => {
    // build user interface
    const html = BillsUI({
      data: bills
    });
    document.body.innerHTML = html;

    // Init firestore
    const store = null;
    // Init Bills
    const allBills = new Bills({
      document,
      onNavigate,
      store,
      localStorage: window.localStorage,
    });

    // Mock modal comportment
    $.fn.modal = jest.fn();

    // Get button eye in DOM
    const eye = screen.getAllByTestId('icon-eye')[0];

    // Mock function handleClickIconEye
    const handleClickIconEye = jest.fn(() =>
      allBills.handleClickIconEye(eye)
    );

    // Add Event and fire
    eye.addEventListener('click', handleClickIconEye);
    userEvent.click(eye);

    // handleClickIconEye function must be called
    expect(handleClickIconEye).toHaveBeenCalled();
    const modale = document.getElementById('modaleFile');
    // The modal must be present
    expect(modale).toBeTruthy();
  })
})

