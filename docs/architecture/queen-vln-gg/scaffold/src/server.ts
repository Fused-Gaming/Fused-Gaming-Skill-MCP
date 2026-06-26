import express from 'express';
import passport from 'passport';
import { registerStrategies } from './auth/passport-strategies.js';
import { createApiRoutes } from './routes/api.js';

const app = express();

app.use(express.json());
app.use(passport.initialize());
registerStrategies();

app.use('/api', createApiRoutes());

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`Queen control plane listening on port ${PORT}`);
});

export default app;
