-- Seed data: 3 stock + 4 custom pieces.
insert into public.products (name, slug, description, type, price_cents, stock_quantity, base_wood_options, images) values
(
  'Mesa Comedor Haya',
  'mesa-comedor-haya',
  'Mesa de comedor en haya maciza con acabado natural. Líneas limpias y juntas cola de milano vistas.',
  'stock',
  189000,
  3,
  array['Roble','Haya'],
  '[{"url":"https://images.unsplash.com/photo-1503602642458-232111445657?w=1200","blurDataURL":"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA","alt":"Mesa Haya"}]'::jsonb
),
(
  'Taburete Nórdico',
  'taburete-nordico',
  'Taburete de pino tratado con aceite de tung. Apilable y ligero.',
  'stock',
  34500,
  12,
  array['Pino'],
  '[{"url":"https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200","blurDataURL":"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA","alt":"Taburete"}]'::jsonb
),
(
  'Estante Colgante Roble',
  'estante-colgante-roble',
  'Estante de pared en roble macizo con herrajes de hierro forjado.',
  'stock',
  78000,
  0,
  array['Roble'],
  '[{"url":"https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200","blurDataURL":"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA","alt":"Estante"}]'::jsonb
),
(
  'Escritorio a Medida',
  'escritorio-a-medida',
  'Escritorio artesanal adaptable a tus dimensiones. Elige madera y acabado.',
  'custom',
  145000,
  0,
  array['Roble','Nogal','Pino'],
  '[{"url":"https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1200","blurDataURL":"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA","alt":"Escritorio"}]'::jsonb
),
(
  'Armario Empotrado',
  'armario-empotrado',
  'Armario a medida con interiores en contrachapado de abedul y frentes en madera maciza.',
  'custom',
  320000,
  0,
  array['Roble','Nogal'],
  '[{"url":"https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1200","blurDataURL":"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA","alt":"Armario"}]'::jsonb
),
(
  'Cabecero Artesanal',
  'cabecero-artesanal',
  'Cabecero tapizado con estructura de madera maciza, personalizable en ancho.',
  'custom',
  98000,
  0,
  array['Roble','Nogal','Pino'],
  '[{"url":"https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200","blurDataURL":"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA","alt":"Cabecero"}]'::jsonb
),
(
  'Mesa de Centro Nogal',
  'mesa-centro-nogal',
  'Mesa de centro en nogal americano con pata central torneada.',
  'custom',
  165000,
  0,
  array['Nogal','Roble'],
  '[{"url":"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200","blurDataURL":"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA","alt":"Mesa centro"}]'::jsonb
)
on conflict (slug) do nothing;
