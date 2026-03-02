import { httpServer } from './src/app.js';
import appConfig from './src/config/config.js';

const PORT = appConfig.port || 5000;

httpServer.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
