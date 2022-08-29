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
import { screen, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES_PATH, ROUTES} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";


import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then mail icon in vertical layout should be highlighted", async () => {
    
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      await waitFor(() => screen.getByTestId('icon-mail'))
      const mailIcon = screen.getByTestId('icon-mail')
      expect(mailIcon.classList.contains('active-icon')).toBeTruthy();
    })
  })
})

describe("When I am on NewBill page but it's loading", () => {
  test('Then I should land on a loading page', () => {
    // build user interface
    const html = NewBillUI({
      data: [],
      loading: true
    });
    document.body.innerHTML = html;
    
    expect(screen.getAllByText('Loading...')).toBeTruthy();
  });
});