import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Reset Session', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Mock the upload API
    await page.route('**/api/upload', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          headers: ['Purchase Order', 'Product Name', 'Country of Origin', 'Supplier', 'Supplier Email', 'Certifications', 'Status of Certifications', 'Material Composition', 'Season', 'Group ID'],
          mapping: {
            purchase_order: 'Purchase Order',
            product_name: 'Product Name',
            country_of_origin: 'Country of Origin',
            supplier: 'Supplier',
            supplier_email: 'Supplier Email',
            certifications: 'Certifications',
            status_of_certifications: 'Status of Certifications',
            material_composition: 'Material Composition',
            season: 'Season',
            group_id: 'Group ID'
          },
          rows: [
            ['PO001', 'Widget A', 'USA', 'Supplier1', 'supplier1@example.com', 'Cert1', 'Valid', 'Plastic', 'Summer', 'G1'],
            ['PO002', 'Widget B', 'Canada', 'Supplier2', 'supplier2@example.com', 'Cert2', 'Expired', 'Metal', 'Winter', 'G2']
          ],
          products: [
            {
              purchase_order: 'PO001',
              product_name: 'Widget A',
              country_of_origin: 'USA',
              supplier: 'Supplier1',
              supplier_email: 'supplier1@example.com',
              certifications: 'Cert1',
              status_of_certifications: 'Valid',
              material_composition: 'Plastic',
              season: 'Summer',
              group_id: 'G1'
            },
            {
              purchase_order: 'PO002',
              product_name: 'Widget B',
              country_of_origin: 'Canada',
              supplier: 'Supplier2',
              supplier_email: 'supplier2@example.com',
              certifications: 'Cert2',
              status_of_certifications: 'Expired',
              material_composition: 'Metal',
              season: 'Winter',
              group_id: 'G2'
            }
          ]
        })
      });
    });
  });

  test('should reset all data when reset button is clicked', async ({ page }) => {
    // Upload file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(path.join(__dirname, 'fixtures', 'sample-products.csv'));
    await page.waitForSelector('text=Product Data Management');

    // Verify data is loaded
    await expect(page.locator('text=Widget A')).toBeVisible();

    // Click reset
    await page.locator('text=Reset Session').click();

    // Check back to initial state
    await expect(page.locator('text=Upload your product data')).toBeVisible();
    await expect(page.locator('text=Widget A')).not.toBeVisible();
  });
});