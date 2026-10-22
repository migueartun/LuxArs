const profiles = {
    'maria-rodriguez': {
        name: 'María Rodríguez',
        specialty: 'Fotografía de bodas',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&q=85',
        work: [
            'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&h=700&fit=crop&q=85',
            'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&h=700&fit=crop&q=85',
            'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&h=700&fit=crop&q=85'
        ]
    },
    'carlos-fernandez': {
        name: 'Carlos Fernández',
        specialty: 'Fotografía de eventos',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=85',
        work: [
            'https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&h=700&fit=crop&q=85',
            'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&h=700&fit=crop&q=85',
            'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=900&h=700&fit=crop&q=85'
        ]
    },
    'ana-lopez': {
        name: 'Ana López García',
        specialty: 'Retratos profesionales',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&q=85',
        work: [
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&h=700&fit=crop&q=85',
            'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=900&h=700&fit=crop&q=85',
            'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=900&h=700&fit=crop&q=85'
        ]
    },
    'diego-martinez': {
        name: 'Diego Martínez',
        specialty: 'Fotografía de producto',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&q=85',
        work: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&h=700&fit=crop&q=85',
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&h=700&fit=crop&q=85',
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&h=700&fit=crop&q=85'
        ]
    },
    'patricia-sanchez': {
        name: 'Patricia Sánchez',
        specialty: 'Fotografía de arquitectura',
        avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop&q=85',
        work: [
            'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&h=700&fit=crop&q=85',
            'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&h=700&fit=crop&q=85',
            'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&h=700&fit=crop&q=85'
        ]
    },
    'roberto-jimenez': {
        name: 'Roberto Jiménez',
        specialty: 'Fotografía de moda',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=85',
        work: [
            'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&h=700&fit=crop&q=85',
            'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&h=700&fit=crop&q=85',
            'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&h=700&fit=crop&q=85'
        ]
    },
    'laura-gomez': {
        name: 'Laura Gómez',
        specialty: 'Fotografía de naturaleza',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&q=85',
        work: [
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&h=700&fit=crop&q=85',
            'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=900&h=700&fit=crop&q=85',
            'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=900&h=700&fit=crop&q=85'
        ]
    },
    'andres-torres': {
        name: 'Andrés Torres',
        specialty: 'Fotografía gastronómica',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&q=85',
        work: [
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&h=700&fit=crop&q=85',
            'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=900&h=700&fit=crop&q=85',
            'https://images.unsplash.com/photo-1547592180-85f173990554?w=900&h=700&fit=crop&q=85'
        ]
    }
};

const profileId = new URLSearchParams(window.location.search).get('profile');
const profile = profiles[profileId] || profiles['maria-rodriguez'];
document.title = `${profile.name} — Portafolio | LuxArs`;
document.getElementById('portfolio-name').textContent = profile.name;
document.getElementById('portfolio-specialty').textContent = profile.specialty;
document.getElementById('portfolio-avatar').style.backgroundImage = `url("${profile.avatar}")`;

const gallery = document.getElementById('portfolio-gallery');
profile.work.forEach((image, index) => {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = image;
    img.alt = `${profile.specialty}, trabajo ${index + 1} de ${profile.name}`;
    img.loading = index === 0 ? 'eager' : 'lazy';
    figure.appendChild(img);
    gallery.appendChild(figure);
});
