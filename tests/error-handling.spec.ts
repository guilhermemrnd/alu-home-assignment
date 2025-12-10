import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Error Handling', () => {
  test('should show error for invalid file', async ({ page }) => {
    await page.goto('/');

    // Mock upload to return error for invalid file
    await page.route('**/api/upload', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Unsupported file type. Only .xlsx, .xls, and .csv are supported.' })
      });
    });

    // Upload invalid file (e.g., a text file)
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'invalid.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('invalid content')
    });

    // Check for error message
    await expect(page.locator('text=Unsupported file type')).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    await page.goto('/');

    // Mock upload
    await page.route('**/api/upload', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          headers: ['Purchase Order', 'Product Name'],
          mapping: { purchase_order: 'Purchase Order', product_name: 'Product Name' },
          rows: [['PO001', 'Widget A']],
          products: [{ purchase_order: 'PO001', product_name: 'Widget A' }]
        })
      });
    });

    // Upload file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(path.join(__dirname, 'fixtures', 'sample-products.csv'));
    await page.waitForSelector('text=Product Data Management');

    // Mock API error for chat
    await page.route('**/api/chat', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });

    // Send chat message
    await page.waitForSelector('textarea');
    await page.locator('textarea').fill('Test message');    
    await page.locator('button').filter({ hasText: 'Send' }).click();    // Check for error alert
    await expect(page.locator('text=Internal server error')).toBeVisible();
  });
});