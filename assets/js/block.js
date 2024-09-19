const { registerBlockType } = wp.blocks;
const el = wp.element.createElement;

registerBlockType('map-openstreet/map-block', {
    title: 'Map OpenStreet',
    icon: 'location',
    category: 'widgets',
    edit: function () {
        return el('div', { id: 'map-container' }, 'Map will display here in the editor.');
    },
    save: function () {
        return el('div', { id: 'map-container' }, 'Map will display here on the frontend.');
    }
});

registerBlockType('map-openstreet/co2-block', {
    title: 'CO2 Emissions Calculator',
    icon: 'chart-bar',
    category: 'widgets',
    edit: function () {
        return el('div', { id: 'chart-container' }, 'CO2 Emissions chart will display here in the editor.');
    },
    save: function () {
        return el('div', { id: 'chart-container' }, 'CO2 Emissions chart will display here on the frontend.');
    }
});