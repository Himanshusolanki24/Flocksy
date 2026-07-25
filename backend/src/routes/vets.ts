import { Router } from 'express';

const vets = [
  {
    id: 'vet-1',
    name: 'Dr. Ananya Kulkarni',
    specialty: 'Poultry pathology',
    city: 'Pune',
    availability: 'Within 4 hours',
  },
  {
    id: 'vet-2',
    name: 'Dr. Raghav Menon',
    specialty: 'Broiler nutrition and flock management',
    city: 'Hyderabad',
    availability: 'Tomorrow morning',
  },
];

export const vetRouter = Router();

vetRouter.get('/', (_req, res) => {
  res.json({ items: vets });
});

vetRouter.get('/:id', (req, res) => {
  const vet = vets.find((item) => item.id === req.params.id);

  if (!vet) {
    return res.status(404).json({ error: 'Vet not found' });
  }

  return res.json(vet);
});
