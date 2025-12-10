import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Chat Interaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Upload file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(path.join(__dirname, 'fixtures', 'sample-products.csv'));
    await page.waitForSelector('text=Product Data Management');

    // Mock the chat API
    await page.route('**/api/chat', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          assistant_message: 'Updated product name successfully.',
          operations: [
            { type: 'updateField', productIndex: 0, field: 'product_name', value: 'Updated Widget A' }
          ]
        })
      });
    });
  });

  test('should send chat message and apply operations', async ({ page }) => {
    // Type a message
    await page.waitForSelector('textarea');
    await page.locator('textarea').fill('Update the first product name to Updated Widget A');

    // Send message
    await page.locator('button').filter({ hasText: 'Send' }).click();

    // Wait for response
    await expect(page.locator('text=Updated product name successfully.')).toBeVisible();

    // Check if product updated
    await expect(page.locator('td').filter({ hasText: 'Updated Widget A' })).toBeVisible();
  });
});