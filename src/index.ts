import { createApp } from '@/app';

const app = createApp();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
    console.log(`📚 Endpoints disponibles (API v1):`);
    console.log(`   - GET  /`);
    console.log(`   - POST /api/v1/freelances`);
    console.log(`   - GET  /api/v1/freelances`);
    console.log(`   - GET  /api/v1/freelances/:id`);
    console.log(`   - GET  /api/v1/freelances/:id/projets-compatibles`);
    console.log(`   - POST /api/v1/freelances/:id/postuler`);
    console.log(`   - POST /api/v1/entreprises`);
    console.log(`   - GET  /api/v1/entreprises`);
    console.log(`   - GET  /api/v1/entreprises/:id`);
    console.log(`   - POST /api/v1/entreprises/:id/projets`);
    console.log(`   - GET  /api/v1/entreprises/:id/projets`);
    console.log(`   - GET  /api/v1/entreprises/:id/projets/:projetId/candidats-compatibles`);
    console.log(`   - GET  /api/v1/projets/ouverts (BONUS)`);
});
