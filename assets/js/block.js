const { registerBlockType } = wp.blocks;
const el = wp.element.createElement;

registerBlockType('mobility-map/map-block', {
    title: 'Mobility Map',
    icon: 'location',
    category: 'widgets',
    edit: function () {
        return el('div', { id: 'map-container' }, 'Map will display here in the editor.');
    },
    save: function () {
        return el('div', { id: 'map-container' }, 'Map will display here on the frontend.');
    }
});

registerBlockType('mobility-map/co2-block', {
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