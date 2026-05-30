export const business = {
  name: 'Yellow City Custom Tees',
  tagline: 'Amarillo made. You dream it, we print it.',
  address: '3708 Olsen Blvd, Amarillo, TX 79109',
  website: 'amarillothreads.com',
  phone: '(806) 803-7255',
  hours: 'Open · Closes 5:30 PM',
  owner: 'Ashton Hammer',
  creator: 'Dillon Richards',
  creatorTitle: 'Creator & Head Designer'
};

export const orders = [
  { id: 'YCCT-0012', date: 'May 30, 2026', customer: 'Walk-In Rush Customer', type: 'Rush DTF tees', method: 'DTF', status: 'New', total: 420, due: 'Today 4:00 PM', quantity: 36, artwork: 'Logo uploaded' },
  { id: 'YCCT-0011', date: 'May 30, 2026', customer: 'Local Team Order', type: 'Team package', method: 'DTF', status: 'Proof Sent', total: 965, due: 'Jun 1, 10:00 AM', quantity: 72, artwork: 'Awaiting approval' },
  { id: 'YCCT-0010', date: 'May 29, 2026', customer: 'Graduation Order', type: 'Graduation hoodies', method: 'DTG', status: 'In Production', total: 705, due: 'Jun 2, 2:00 PM', quantity: 18, artwork: 'Approved' },
  { id: 'YCCT-0009', date: 'May 28, 2026', customer: 'Business Uniform Account', type: 'Business polos', method: 'Embroidery', status: 'Quality Check', total: 1180, due: 'Jun 3, 5:00 PM', quantity: 44, artwork: 'Approved' },
  { id: 'YCCT-0008', date: 'May 27, 2026', customer: 'Birthday Event Order', type: 'Birthday tees', method: 'DTF', status: 'Ready', total: 204.5, due: 'Pickup today', quantity: 12, artwork: 'Approved' },
  { id: 'YCCT-0007', date: 'May 26, 2026', customer: 'Banner Pickup Order', type: 'Banners + shirts', method: 'Mixed', status: 'Picked Up', total: 378.81, due: 'Completed', quantity: 24, artwork: 'Archived' }
];

export const inventory = [
  { sku: 'G500-BLK', item: 'Gildan Heavy Cotton Tee', color: 'Black', stock: 128, reorder: 60, bestFor: 'DTF / vinyl' },
  { sku: 'BC3001-WHT', item: 'Bella+Canvas 3001', color: 'White', stock: 42, reorder: 50, bestFor: 'DTG / premium' },
  { sku: 'CC1717-PEP', item: 'Comfort Colors 1717', color: 'Pepper', stock: 18, reorder: 30, bestFor: 'Boutique merch' },
  { sku: 'NL6210-NAV', item: 'Next Level CVC Tee', color: 'Navy', stock: 67, reorder: 45, bestFor: 'Business shirts' },
  { sku: 'YC-DTF-22', item: 'DTF Film Roll', color: 'Cold Peel', stock: 4, reorder: 6, bestFor: 'Production supply' }
];

export const customers = [
  { name: 'Walk-In Rush Customer', segment: 'Walk-in', orders: 1, value: 420, status: 'Needs intake' },
  { name: 'Local Team Order', segment: 'Team', orders: 7, value: 5160, status: 'Repeat' },
  { name: 'Business Uniform Account', segment: 'Business', orders: 5, value: 4210, status: 'VIP' },
  { name: 'Graduation Order', segment: 'Graduation', orders: 1, value: 705, status: 'Proof sent' },
  { name: 'Event Merch Order', segment: 'Event', orders: 2, value: 512, status: 'Pickup' }
];

export const services = [
  'Custom T-Shirts',
  'Business Uniforms',
  'DTF Transfers',
  'Graduation Shirts',
  'Team Apparel',
  'Banners & Event Merch'
];
