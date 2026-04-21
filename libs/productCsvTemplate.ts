// Product CSV Import Template Generator
// Provides comprehensive CSV templates with field descriptions and sample data

export interface FieldDefinition {
  name: string
  label: string
  type: 'text' | 'number' | 'url' | 'boolean' | 'choice'
  required: boolean
  description: string
  example?: string
  choices?: string[]
}

export const PRODUCT_CSV_FIELDS: FieldDefinition[] = [
  {
    name: 'pd_name',
    label: 'Product Name',
    type: 'text',
    required: true,
    description: 'The name/title of the product',
    example: 'Modern Living Room Chair',
  },
  {
    name: 'pd_catid',
    label: 'Category ID',
    type: 'number',
    required: true,
    description: 'Numeric ID of the product category. View all categories in Admin > Products > Categories',
    example: '12',
  },
  {
    name: 'pd_price_srp',
    label: 'SRP (Suggested Retail Price)',
    type: 'number',
    required: true,
    description: 'Suggested retail price in PHP (base price)',
    example: '4999.00',
  },
  {
    name: 'pd_parent_sku',
    label: 'SKU (Stock Keeping Unit)',
    type: 'text',
    required: false,
    description: 'Unique identifier for the product. Used for "Create or Update" mode to match products',
    example: 'CHAIR-LIV-001',
  },
  {
    name: 'pd_brand_type',
    label: 'Brand ID',
    type: 'number',
    required: false,
    description: 'Numeric ID of the product brand',
    example: '5',
  },
  {
    name: 'pd_catsubid',
    label: 'Subcategory ID',
    type: 'number',
    required: false,
    description: 'Numeric ID of the product subcategory (if applicable)',
    example: '45',
  },
  {
    name: 'pd_room_type',
    label: 'Room Type',
    type: 'choice',
    required: false,
    description: 'Room type: 1=Living Room, 2=Bedroom, 3=Kitchen, 4=Dining, 5=Office, 6=Bathroom, 7=Other',
    example: '1',
    choices: ['1', '2', '3', '4', '5', '6', '7'],
  },
  {
    name: 'pd_price_dp',
    label: 'DP Price (Distributor Price)',
    type: 'number',
    required: false,
    description: 'Special pricing for distributor members',
    example: '3999.00',
  },
  {
    name: 'pd_price_member',
    label: 'Member Price',
    type: 'number',
    required: false,
    description: 'Special pricing for regular members',
    example: '3599.00',
  },
  {
    name: 'pd_prodpv',
    label: 'Product PV (Point Value)',
    type: 'number',
    required: false,
    description: 'Points earned when product is purchased',
    example: '100',
  },
  {
    name: 'pd_qty',
    label: 'Quantity',
    type: 'number',
    required: false,
    description: 'Initial stock quantity',
    example: '50',
  },
  {
    name: 'pd_weight',
    label: 'Weight (kg)',
    type: 'number',
    required: false,
    description: 'Product weight for shipping calculations',
    example: '12.5',
  },
  {
    name: 'pd_psweight',
    label: 'Packaged Weight (kg)',
    type: 'number',
    required: false,
    description: 'Weight including packaging',
    example: '14.0',
  },
  {
    name: 'pd_pswidth',
    label: 'Packaged Width (cm)',
    type: 'number',
    required: false,
    description: 'Width of packaged product',
    example: '120',
  },
  {
    name: 'pd_pslenght',
    label: 'Packaged Length (cm)',
    type: 'number',
    required: false,
    description: 'Length of packaged product (note: field name has typo "pslenght")',
    example: '80',
  },
  {
    name: 'pd_psheight',
    label: 'Packaged Height (cm)',
    type: 'number',
    required: false,
    description: 'Height of packaged product',
    example: '40',
  },
  {
    name: 'pd_description',
    label: 'Description',
    type: 'text',
    required: false,
    description: 'Detailed product description. Can use HTML tags. For multi-line, wrap in quotes',
    example: 'Premium quality chair with ergonomic design',
  },
  {
    name: 'pd_specifications',
    label: 'Specifications',
    type: 'text',
    required: false,
    description: 'Product specifications (materials, features, etc.)',
    example: 'Fabric: Premium leather, Legs: Solid wood',
  },
  {
    name: 'pd_material',
    label: 'Material',
    type: 'text',
    required: false,
    description: 'Primary material composition',
    example: 'Premium Leather',
  },
  {
    name: 'pd_warranty',
    label: 'Warranty',
    type: 'text',
    required: false,
    description: 'Warranty information',
    example: '2 Years Manufacturing Defect',
  },
  {
    name: 'pd_image',
    label: 'Primary Image URL',
    type: 'url',
    required: false,
    description: 'Full URL to the main product image',
    example: 'https://example.com/images/chair-001.jpg',
  },
  {
    name: 'pd_images',
    label: 'Additional Images (Multiple URLs)',
    type: 'url',
    required: false,
    description: 'Multiple image URLs separated by pipe character (|)',
    example: 'https://example.com/chair-002.jpg|https://example.com/chair-003.jpg',
  },
  {
    name: 'pd_type',
    label: 'Product Type',
    type: 'choice',
    required: false,
    description: 'Type: simple, variable (for products with variants)',
    example: 'simple',
    choices: ['simple', 'variable'],
  },
  {
    name: 'pd_status',
    label: 'Status',
    type: 'choice',
    required: false,
    description: '1=Active/Published, 0=Inactive/Draft',
    example: '1',
    choices: ['0', '1'],
  },
  {
    name: 'pd_musthave',
    label: 'Must Have',
    type: 'boolean',
    required: false,
    description: 'Mark as essential/must-have product (1=yes, 0=no)',
    example: '0',
  },
  {
    name: 'pd_bestseller',
    label: 'Best Seller',
    type: 'boolean',
    required: false,
    description: 'Mark as bestseller (1=yes, 0=no)',
    example: '1',
  },
  {
    name: 'pd_salespromo',
    label: 'Sales Promo',
    type: 'boolean',
    required: false,
    description: 'Include in sales promotion (1=yes, 0=no)',
    example: '0',
  },
  {
    name: 'pd_assembly_required',
    label: 'Assembly Required',
    type: 'boolean',
    required: false,
    description: 'Requires assembly (1=yes, 0=no)',
    example: '1',
  },
  {
    name: 'pd_verified',
    label: 'Verified',
    type: 'boolean',
    required: false,
    description: 'Product verified status (1=yes, 0=no)',
    example: '0',
  },
]

const SAMPLE_PRODUCTS = [
  {
    pd_name: 'Modern Living Room Chair',
    pd_parent_sku: 'CHAIR-LIV-001',
    pd_catid: 12,
    pd_room_type: 1,
    pd_brand_type: 5,
    pd_price_srp: 4999.00,
    pd_price_dp: 3999.00,
    pd_price_member: 3599.00,
    pd_prodpv: 100,
    pd_qty: 50,
    pd_weight: 12.5,
    pd_psweight: 14.0,
    pd_pswidth: 120,
    pd_pslenght: 80,
    pd_psheight: 40,
    pd_material: 'Premium Leather',
    pd_warranty: '2 Years',
    pd_status: 1,
    pd_bestseller: 1,
    pd_assembly_required: 1,
  },
  {
    pd_name: 'Wooden Dining Table',
    pd_parent_sku: 'TABLE-DIN-001',
    pd_catid: 15,
    pd_room_type: 4,
    pd_brand_type: 3,
    pd_price_srp: 8999.00,
    pd_price_dp: 7199.00,
    pd_price_member: 6499.00,
    pd_prodpv: 150,
    pd_qty: 25,
    pd_weight: 45.0,
    pd_psweight: 50.0,
    pd_pswidth: 180,
    pd_pslenght: 100,
    pd_psheight: 80,
    pd_material: 'Solid Mahogany',
    pd_warranty: '3 Years',
    pd_status: 1,
    pd_musthave: 1,
  },
  {
    pd_name: 'Bedroom Queen Bed Frame',
    pd_parent_sku: 'BED-QUEEN-001',
    pd_catid: 18,
    pd_room_type: 2,
    pd_brand_type: 7,
    pd_price_srp: 12999.00,
    pd_price_dp: 10399.00,
    pd_price_member: 9399.00,
    pd_prodpv: 200,
    pd_qty: 30,
    pd_weight: 65.0,
    pd_psweight: 72.0,
    pd_pswidth: 200,
    pd_pslenght: 160,
    pd_psheight: 45,
    pd_material: 'Steel + Wood',
    pd_warranty: '5 Years',
    pd_status: 1,
    pd_assembly_required: 1,
  },
]

export function buildTemplateWithInstructions(): string {
  const lines: string[] = []

  lines.push('# AFHOME PRODUCT CSV IMPORT TEMPLATE')
  lines.push('# Generated for easy bulk product uploads')
  lines.push('')
  lines.push('## INSTRUCTIONS:')
  lines.push('# 1. REQUIRED FIELDS (must fill in ALL of these):')
  lines.push('#    - pd_name: Product name')
  lines.push('#    - pd_catid: Category ID (numeric, see "Category Reference" section below)')
  lines.push('#    - pd_price_srp: SRP price in PHP')
  lines.push('#')
  lines.push('# 2. OPTIONAL FIELDS: Leave blank if not applicable')
  lines.push('#    - SKU is important for "Create or Update" mode (matches existing products)')
  lines.push('#    - For multiple images, separate URLs with pipe character: url1|url2|url3')
  lines.push('#    - Prices and quantities should be numeric only (no commas, no currency symbols)')
  lines.push('#    - Boolean fields use 1=yes, 0=no')
  lines.push('#')
  lines.push('# 3. NOTES:')
  lines.push('#    - Text with commas or special chars should be wrapped in quotes: "Text, with, commas"')
  lines.push('#    - Leave required fields empty to skip that row (it will be marked as failed)')
  lines.push('#    - Always use CSV format (comma-separated values)')
  lines.push('#')
  lines.push('## CATEGORY REFERENCE:')
  lines.push('# Common categories (use pd_catid for these):')
  lines.push('# 12 = Living Room Furniture')
  lines.push('# 15 = Dining Room Furniture')
  lines.push('# 18 = Bedroom Furniture')
  lines.push('# 20 = Kitchen & Dining')
  lines.push('# 25 = Office Furniture')
  lines.push('# 28 = Outdoor Furniture')
  lines.push('# 30 = Decorative Items')
  lines.push('# NOTE: See Admin > Products > Categories page for complete list')
  lines.push('')
  lines.push('## FIELD DEFINITIONS:')

  PRODUCT_CSV_FIELDS.forEach(field => {
    const req = field.required ? '[REQUIRED]' : '[optional]'
    lines.push(`# ${field.name}: ${field.label} ${req}`)
    lines.push(`#   Type: ${field.type}`)
    lines.push(`#   Description: ${field.description}`)
    if (field.example) {
      lines.push(`#   Example: ${field.example}`)
    }
    if (field.choices && field.choices.length > 0) {
      lines.push(`#   Valid values: ${field.choices.join(', ')}`)
    }
  })

  lines.push('')
  lines.push('## SAMPLE DATA (uncomment or modify to use):')
  lines.push('')

  // Header row
  const headerCols = [
    'pd_name',
    'pd_parent_sku',
    'pd_catid',
    'pd_price_srp',
    'pd_price_dp',
    'pd_price_member',
    'pd_prodpv',
    'pd_qty',
    'pd_weight',
    'pd_material',
    'pd_warranty',
    'pd_status',
    'pd_bestseller',
    'pd_assembly_required',
  ]
  lines.push(headerCols.join(','))

  // Sample rows
  SAMPLE_PRODUCTS.forEach(product => {
    const row = headerCols.map(col => {
      const val = product[col as keyof typeof product]
      if (typeof val === 'string' && val.includes(',')) {
        return `"${val}"`
      }
      return String(val ?? '')
    })
    lines.push(row.join(','))
  })

  return lines.join('\n')
}

export function buildSimpleTemplate(): string {
  const headerCols = [
    'pd_name',
    'pd_parent_sku',
    'pd_catid',
    'pd_price_srp',
    'pd_price_dp',
    'pd_price_member',
    'pd_qty',
    'pd_weight',
    'pd_material',
    'pd_status',
  ]

  const rows: string[] = [headerCols.join(',')]

  SAMPLE_PRODUCTS.forEach(product => {
    const row = headerCols.map(col => {
      const val = product[col as keyof typeof product]
      if (typeof val === 'string' && val.includes(',')) {
        return `"${val}"`
      }
      return String(val ?? '')
    })
    rows.push(row.join(','))
  })

  return rows.join('\n')
}

export function buildAllFieldsTemplate(): string {
  const headerCols = PRODUCT_CSV_FIELDS.map(f => f.name)
  const rows: string[] = [headerCols.join(',')]

  SAMPLE_PRODUCTS.forEach(product => {
    const row = headerCols.map(col => {
      const val = product[col as keyof typeof product]
      if (typeof val === 'string' && val.includes(',')) {
        return `"${val}"`
      }
      return String(val ?? '')
    })
    rows.push(row.join(','))
  })

  return rows.join('\n')
}
