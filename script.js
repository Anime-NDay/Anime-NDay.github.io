// not my best code but at least it's not one file, guh web dev

let nationSpecialties = {};
let cache = {};
let currentCustomisation = {};

// Color presets
const presets = {
    default: {
        bgColor: '#8B0000',
        borderColor: '#FFD700',
        headerBgColor: '#DAA520',
        headerTextColor: '#000000',
        hoverColor: '#A00000',
        textColor: '#FFFFFF',
        militaryColor: '#FF7D7D',
        strategicColor: '#7DA6FF',
        cleanupColor: '#7DFFB2',
        economicColor: '#FFE77D',
        unknownColor: '#CFCFCF'
    },
    dark: {
        bgColor: '#1a1a1a',
        borderColor: '#333333',
        headerBgColor: '#444444',
        headerTextColor: '#ffffff',
        hoverColor: '#333333',
        textColor: '#cccccc',
        militaryColor: '#ff6b6b',
        strategicColor: '#4ecdc4',
        cleanupColor: '#45b7d1',
        economicColor: '#f9ca24',
        unknownColor: '#a4b0be'
    },
    military: {
        bgColor: '#2c3e50',
        borderColor: '#e74c3c',
        headerBgColor: '#c0392b',
        headerTextColor: '#ffffff',
        hoverColor: '#34495e',
        textColor: '#ecf0f1',
        militaryColor: '#e74c3c',
        strategicColor: '#3498db',
        cleanupColor: '#2ecc71',
        economicColor: '#f39c12',
        unknownColor: '#95a5a6'
    },
    cyber: {
        bgColor: '#0a0a0a',
        borderColor: '#00ff00',
        headerBgColor: '#001100',
        headerTextColor: '#00ff00',
        hoverColor: '#003300',
        textColor: '#00ff00',
        militaryColor: '#ff0040',
        strategicColor: '#00ffff',
        cleanupColor: '#40ff00',
        economicColor: '#ffff00',
        unknownColor: '#808080'
    },
    elegant: {
        bgColor: '#2c2c54',
        borderColor: '#a40e4c',
        headerBgColor: '#a40e4c',
        headerTextColor: '#ffffff',
        hoverColor: '#40407a',
        textColor: '#f8f8f8',
        militaryColor: '#ff6b6b',
        strategicColor: '#4ecdc4',
        cleanupColor: '#45b7d1',
        economicColor: '#f9ca24',
        unknownColor: '#a4b0be'
    }
};

// Tab switching
function switchTab(tabName) {
    // Remove active class from all tabs and content
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Apply color preset
function applyPreset(presetName) {
    const preset = presets[presetName];
    if (preset) {
        Object.keys(preset).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = preset[key];
            }
        });
        updatePreview();
    }
    
    // Update active preset button
    document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[onclick="applyPreset('${presetName}')"]`).classList.add('active');
}

// Update preview
function updatePreview() {
    const previewContainer = document.getElementById('previewContainer');
    const puppetsList = document.getElementById('puppetsList').value.trim();
    
    if (!puppetsList) {
        previewContainer.innerHTML = '<p>Enter some nations and click "Generate Table" to see a preview of your customised table.</p>';
        return;
    }
    
    const puppets = puppetsList.split('\n').filter(nation => nation.trim().length > 0);
    if (puppets.length === 0) {
        previewContainer.innerHTML = '<p>Enter some nations and click "Generate Table" to see a preview of your customised table.</p>';
        return;
    }
    
    // Generate preview with current customisation
    const previewHtml = generatePreviewTable(puppets.slice(0, 3)); // Show first 3 nations as preview
    previewContainer.innerHTML = previewHtml;
}

// Generate preview table
function generatePreviewTable(puppets) {
    const customisation = getCurrentCustomisation();
    
    // Get faction IDs from form inputs
    const enemyFactionId = document.getElementById('enemyFactionId').value || CONFIG.factionIds.enemyFactionId;
    const incomingFactionId = document.getElementById('incomingFactionId').value || CONFIG.factionIds.incomingFactionId;
    const myFactionId = document.getElementById('myFactionId').value || CONFIG.factionIds.myFactionId;
    
    // Generate config links with custom faction IDs
    const configLinks = {
        'Production': 'page=nukes/view=production',
        'Incoming': `page=faction/fid=${incomingFactionId}/view=incoming`,
        'Target': `page=faction/fid=${enemyFactionId}/view=nations/start=0`,
        'Launch': 'page=nukes/view=targets',
        'Join': `page=faction/fid=${myFactionId}?consider_join_faction=1&join_faction=1`
    };
    
    let html = `
        <table style="
            width: ${customisation.tableWidth}%;
            background-color: ${customisation.bgColor};
            border: ${customisation.borderWidth}px solid ${customisation.borderColor};
            border-radius: ${customisation.borderRadius}px;
            font-family: ${customisation.fontFamily};
            font-size: ${customisation.fontSize}px;
            opacity: ${customisation.opacity};
            margin: 20px auto;
            text-align: left;
            color: ${customisation.textColor};
            ${customisation.enableShadows ? 'box-shadow: 0 4px 8px rgba(0,0,0,0.3);' : ''}
        ">
            <thead>
                <tr>
                    <th style="
                        background-color: ${customisation.headerBgColor};
                        color: ${customisation.headerTextColor};
                        font-size: ${customisation.headerFontSize}px;
                        font-weight: ${customisation.fontWeight};
                        padding: ${customisation.cellPadding}px;
                        border-bottom: ${customisation.borderWidth}px solid ${customisation.borderColor};
                    ">Nation</th>
                    <th style="
                        background-color: ${customisation.headerBgColor};
                        color: ${customisation.headerTextColor};
                        font-size: ${customisation.headerFontSize}px;
                        font-weight: ${customisation.fontWeight};
                        padding: ${customisation.cellPadding}px;
                        border-bottom: ${customisation.borderWidth}px solid ${customisation.borderColor};
                    ">Specialty</th>`;
    
    // Add dynamic columns from config
    for (const [key, value] of Object.entries(configLinks)) {
        html += `
                    <th style="
                        background-color: ${customisation.headerBgColor};
                        color: ${customisation.headerTextColor};
                        font-size: ${customisation.headerFontSize}px;
                        font-weight: ${customisation.fontWeight};
                        padding: ${customisation.cellPadding}px;
                        border-bottom: ${customisation.borderWidth}px solid ${customisation.borderColor};
                    ">${key}</th>`;
    }
    
    html += `
                </tr>
            </thead>
            <tbody>
    `;
    
    puppets.forEach((nation, index) => {
        const specialty = cache[nation] || 'U';
        const specialtyClass = getSpecialtyClass(specialty);
        const specialtyName = getSpecialtyName(specialty);
        const specialtyColor = getSpecialtyColor(specialty);
        const canonical = nation.toLowerCase().replace(/\s+/g, '_');
        const containerPrefix = `container=${canonical}/nation=${canonical}`;
        
        let rowStyle = `
            padding: ${customisation.cellPadding}px;
            border-bottom: ${customisation.borderWidth}px solid ${customisation.borderColor};
        `;
        
        if (customisation.enableStripes && index % 2 === 1) {
            rowStyle += `background-color: rgba(255,255,255,0.05);`;
        }
        
        if (customisation.enableHover) {
            rowStyle += `transition: background-color 0.3s;`;
        }
        
        html += `
            <tr style="${rowStyle}" onmouseover="this.style.backgroundColor='${customisation.hoverColor}'" onmouseout="this.style.backgroundColor=''">
                <td style="padding: ${customisation.cellPadding}px;"><a href="#" style="color: ${customisation.textColor}; text-decoration: none;">${nation}</a></td>
                <td style="padding: ${customisation.cellPadding}px; color: ${specialtyColor};">${specialtyName}</td>`;
        
        // Add dynamic columns from config
        for (const [key, value] of Object.entries(configLinks)) {
            html += `
                <td style="padding: ${customisation.cellPadding}px;"><a href="#" style="color: ${customisation.textColor}; text-decoration: none;">${key}</a></td>`;
        }
        
        html += `
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    return html;
}

// Get current customisation settings
function getCurrentCustomisation() {
    return {
        bgColor: document.getElementById('bgColor').value,
        borderColor: document.getElementById('borderColor').value,
        headerBgColor: document.getElementById('headerBgColor').value,
        headerTextColor: document.getElementById('headerTextColor').value,
        hoverColor: document.getElementById('hoverColor').value,
        textColor: document.getElementById('textColor').value,
        militaryColor: document.getElementById('militaryColor').value,
        strategicColor: document.getElementById('strategicColor').value,
        cleanupColor: document.getElementById('cleanupColor').value,
        economicColor: document.getElementById('economicColor').value,
        unknownColor: document.getElementById('unknownColor').value,
        tableWidth: document.getElementById('tableWidth').value,
        cellPadding: document.getElementById('cellPadding').value,
        borderWidth: document.getElementById('borderWidth').value,
        borderRadius: document.getElementById('borderRadius').value,
        tableAlignment: document.getElementById('tableAlignment').value,
        fontFamily: document.getElementById('fontFamily').value,
        fontSize: document.getElementById('fontSize').value,
        headerFontSize: document.getElementById('headerFontSize').value,
        fontWeight: document.getElementById('fontWeight').value,
        enableHover: document.getElementById('enableHover').checked,
        enableStripes: document.getElementById('enableStripes').checked,
        enableShadows: document.getElementById('enableShadows').checked,
        enableGradient: document.getElementById('enableGradient').checked,
        opacity: document.getElementById('opacity').value
    };
}

// Get specialty class
function getSpecialtyClass(specialty) {
    const mapping = { 'S': 'speciality-S', 'M': 'speciality-M', 'C': 'speciality-C', 'E': 'speciality-E', 'U': 'speciality-U' };
    return mapping[specialty] || 'speciality-U';
}

// Get specialty name
function getSpecialtyName(specialty) {
    const mapping = { 'S': 'Strategic', 'M': 'Military', 'C': 'Cleanup', 'E': 'Economic', 'U': 'Unknown' };
    return mapping[specialty] || 'Unknown';
}

// Get specialty color
function getSpecialtyColor(specialty) {
    const customisation = getCurrentCustomisation();
    const mapping = {
        'S': customisation.strategicColor,
        'M': customisation.militaryColor,
        'C': customisation.cleanupColor,
        'E': customisation.economicColor,
        'U': customisation.unknownColor
    };
    return mapping[specialty] || customisation.unknownColor;
}

// Update range value displays
function updateRangeValues() {
    document.getElementById('tableWidthValue').textContent = document.getElementById('tableWidth').value + '%';
    document.getElementById('cellPaddingValue').textContent = document.getElementById('cellPadding').value + 'px';
    document.getElementById('borderWidthValue').textContent = document.getElementById('borderWidth').value + 'px';
    document.getElementById('borderRadiusValue').textContent = document.getElementById('borderRadius').value + 'px';
    document.getElementById('fontSizeValue').textContent = document.getElementById('fontSize').value + 'px';
    document.getElementById('headerFontSizeValue').textContent = document.getElementById('headerFontSize').value + 'px';
    document.getElementById('opacityValue').textContent = Math.round(document.getElementById('opacity').value * 100) + '%';
}

// Load cache from localStorage
function loadCache() {
    const savedCache = localStorage.getItem('ndayCache');
    if (savedCache) {
        try {
            cache = JSON.parse(savedCache);
            updateCacheInfo();
        } catch (e) {
            console.error('Error parsing cache:', e);
            cache = {};
        }
    }
}

// Save cache to localStorage
function saveCache() {
    localStorage.setItem('ndayCache', JSON.stringify(cache));
    updateCacheInfo();
}

// Update cache info display
function updateCacheInfo() {
    const cacheInfo = document.getElementById('cacheInfo');
    const cacheStatus = document.getElementById('cacheStatus');
    const cacheCount = Object.keys(cache).length;
    
    if (cacheCount > 0) {
        cacheInfo.classList.remove('hidden');
        cacheStatus.textContent = `${cacheCount} nations cached`;
    } else {
        cacheInfo.classList.add('hidden');
    }
}

// Handle cache file upload
document.getElementById('cacheFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const csvContent = e.target.result;
                const lines = csvContent.split('\n').filter(line => line.trim());
                const newCache = {};
                
                for (const line of lines) {
                    const [nation, specialty] = line.split(',').map(s => s.trim());
                    if (nation && specialty) {
                        newCache[nation] = specialty;
                    }
                }
                
                cache = newCache;
                saveCache();
                showStatus(`Successfully loaded ${Object.keys(cache).length} nations from cache file.`, 'success');
                updatePreview();
            } catch (error) {
                showStatus('Error parsing cache file. Please ensure it\'s a valid CSV file.', 'error');
            }
        };
        reader.readAsText(file);
    }
});

// Clear cache
function clearCache() {
    cache = {};
    saveCache();
    showStatus('Cache cleared successfully.', 'success');
    updatePreview();
}

// Show status message
function showStatus(message, type = 'info') {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = `status ${type}`;
    status.classList.remove('hidden');
}

// Hide status
function hideStatus() {
    document.getElementById('status').classList.add('hidden');
}

// Get nation specialty from API
async function getNationSpecialty(nationName) {
    const url = `https://www.nationstates.net/cgi-bin/api.cgi?nation=${nationName}&q=nstats`;
    const headers = {
        'User-Agent': 'NDayPuppetManager/1.0 (Web Version)'
    };
    
    try {
        const response = await fetch(url, { headers });
        if (response.ok) {
            const text = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, 'text/xml');
            const specialtyElement = xmlDoc.querySelector('SPECIALTY');
            
            if (specialtyElement) {
                const specialty = specialtyElement.textContent;
                const specialtyMapping = {
                    'Military': 'M',
                    'Strategic': 'S',
                    'Cleanup': 'C',
                    'Economic': 'E'
                };
                return specialtyMapping[specialty] || 'U';
            }
        }
        return 'U';
    } catch (error) {
        console.error(`Error fetching specialty for ${nationName}:`, error);
        return 'U';
    }
}

// Generate table
async function generateTable() {
    const puppetsList = document.getElementById('puppetsList').value.trim();
    const mainNation = document.getElementById('mainNation').value.trim();
    const sortingOrder = document.getElementById('sortingOrder').value;
    
    if (!puppetsList) {
        showStatus('Please enter at least one nation name.', 'error');
        return;
    }
    
    if (!mainNation) {
        showStatus('Please enter your main nation name.', 'error');
        return;
    }
    
    const puppets = puppetsList.split('\n').filter(nation => nation.trim().length > 0);
    
    showStatus('Loading cached specialties...', 'loading');
    
    // Load cache
    loadCache();
    
    // Check which nations need API calls
    const nationsToFetch = [];
    for (const nation of puppets) {
        const cleanNation = nation.trim();
        if (!cache[cleanNation]) {
            nationsToFetch.push(cleanNation);
        }
    }
    
    if (nationsToFetch.length > 0) {
        showStatus(`Fetching specialties for ${nationsToFetch.length} new nations...`, 'loading');
        
        for (let i = 0; i < nationsToFetch.length; i++) {
            const nation = nationsToFetch[i];
            showStatus(`Fetching specialty for ${nation}... (${i + 1}/${nationsToFetch.length})`, 'loading');
            
            const specialty = await getNationSpecialty(nation);
            cache[nation] = specialty;
            
            // Rate limiting - wait 0.7 seconds between calls
            if (i < nationsToFetch.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 700));
            }
        }
        
        // Save updated cache
        saveCache();
    } else {
        showStatus('All nations found in cache, no API calls needed!', 'success');
    }
    
    // Filter out nations not in current list
    const currentNations = new Set(puppets.map(n => n.trim()));
    const filteredCache = {};
    for (const [nation, specialty] of Object.entries(cache)) {
        if (currentNations.has(nation)) {
            filteredCache[nation] = specialty;
        }
    }
    
    // Sort nations based on specialty order
    const sortedNations = {};
    for (const specialty of sortingOrder) {
        sortedNations[specialty] = [];
    }
    
    for (const [nation, specialty] of Object.entries(filteredCache)) {
        if (sortedNations[specialty]) {
            sortedNations[specialty].push(nation);
        }
    }
    
    // Generate HTML table
    generateHtmlTable(sortedNations, mainNation, sortingOrder);
    
    // Generate download files
    generateDownloadFiles(sortedNations, mainNation, sortingOrder);
    
    showStatus('Table generated successfully!', 'success');
    document.getElementById('results').classList.remove('hidden');
}

// Generate HTML table
function generateHtmlTable(sortedNations, mainNation, sortingOrder) {
    const customisation = getCurrentCustomisation();
    
    // Get faction IDs from form inputs
    const enemyFactionId = document.getElementById('enemyFactionId').value || CONFIG.factionIds.enemyFactionId;
    const incomingFactionId = document.getElementById('incomingFactionId').value || CONFIG.factionIds.incomingFactionId;
    const myFactionId = document.getElementById('myFactionId').value || CONFIG.factionIds.myFactionId;
    
    // Generate config links with custom faction IDs
    const configLinks = {
        'Production': 'page=nukes/view=production',
        'Incoming': `page=faction/fid=${incomingFactionId}/view=incoming`,
        'Target': `page=faction/fid=${enemyFactionId}/view=nations/start=0`,
        'Launch': 'page=nukes/view=targets',
        'Join': `page=faction/fid=${myFactionId}?consider_join_faction=1&join_faction=1`
    };
    
    let html = `
        <table style="
            width: ${customisation.tableWidth}%;
            background-color: ${customisation.bgColor};
            border: ${customisation.borderWidth}px solid ${customisation.borderColor};
            border-radius: ${customisation.borderRadius}px;
            font-family: ${customisation.fontFamily};
            font-size: ${customisation.fontSize}px;
            opacity: ${customisation.opacity};
            margin: 20px auto;
            text-align: left;
            color: ${customisation.textColor};
            ${customisation.enableShadows ? 'box-shadow: 0 4px 8px rgba(0,0,0,0.3);' : ''}
        ">
            <thead>
                <tr>
                    <th style="
                        background-color: ${customisation.headerBgColor};
                        color: ${customisation.headerTextColor};
                        font-size: ${customisation.headerFontSize}px;
                        font-weight: ${customisation.fontWeight};
                        padding: ${customisation.cellPadding}px;
                        border-bottom: ${customisation.borderWidth}px solid ${customisation.borderColor};
                    ">Nation</th>
                    <th style="
                        background-color: ${customisation.headerBgColor};
                        color: ${customisation.headerTextColor};
                        font-size: ${customisation.headerFontSize}px;
                        font-weight: ${customisation.fontWeight};
                        padding: ${customisation.cellPadding}px;
                        border-bottom: ${customisation.borderWidth}px solid ${customisation.borderColor};
                    ">Specialty</th>`;
    
    // Add dynamic columns from config
    for (const [key, value] of Object.entries(configLinks)) {
        html += `
                    <th style="
                        background-color: ${customisation.headerBgColor};
                        color: ${customisation.headerTextColor};
                        font-size: ${customisation.headerFontSize}px;
                        font-weight: ${customisation.fontWeight};
                        padding: ${customisation.cellPadding}px;
                        border-bottom: ${customisation.borderWidth}px solid ${customisation.borderColor};
                    ">${key}</th>`;
    }
    
    html += `
                </tr>
            </thead>
            <tbody>
    `;
    
    for (const specialty of sortingOrder) {
        for (const nation of sortedNations[specialty] || []) {
            const specialtyClass = getSpecialtyClass(specialty);
            const specialtyName = getSpecialtyName(specialty);
            const specialtyColor = getSpecialtyColor(specialty);
            const canonical = nation.toLowerCase().replace(/\s+/g, '_');
            const containerPrefix = `container=${canonical}/nation=${canonical}`;
            
            let rowStyle = `
                padding: ${customisation.cellPadding}px;
                border-bottom: ${customisation.borderWidth}px solid ${customisation.borderColor};
            `;
            
            if (customisation.enableStripes) {
                rowStyle += `background-color: rgba(255,255,255,0.05);`;
            }
            
            if (customisation.enableHover) {
                rowStyle += `transition: background-color 0.3s;`;
            }
            
            html += `
                <tr style="${rowStyle}" onmouseover="this.style.backgroundColor='${customisation.hoverColor}'" onmouseout="this.style.backgroundColor=''">
                    <td style="padding: ${customisation.cellPadding}px;"><a href="https://www.nationstates.net/${containerPrefix}/nation=${canonical}?generated_by=cat_nuke_thing_by_catiania_used_by_${mainNation}" target="_blank" style="color: ${customisation.textColor}; text-decoration: none;">${nation}</a></td>
                    <td style="padding: ${customisation.cellPadding}px; color: ${specialtyColor};">${specialtyName}</td>`;
            
            // Add dynamic columns from config
            for (const [key, value] of Object.entries(configLinks)) {
                html += `
                    <td style="padding: ${customisation.cellPadding}px;"><a href="https://www.nationstates.net/${containerPrefix}/${value}?generated_by=cat_nuke_thing_by_catiania_used_by_${mainNation}" target="_blank" style="color: ${customisation.textColor}; text-decoration: none;">${key}</a></td>`;
            }
            
            html += `
                </tr>
            `;
        }
    }
    
    html += `
            </tbody>
        </table>
    `;
    
    document.getElementById('tableContainer').innerHTML = html;
}

// Generate download files
function generateDownloadFiles(sortedNations, mainNation, sortingOrder) {
    const customisation = getCurrentCustomisation();
    
    // Get faction IDs from form inputs
    const enemyFactionId = document.getElementById('enemyFactionId').value || CONFIG.factionIds.enemyFactionId;
    const incomingFactionId = document.getElementById('incomingFactionId').value || CONFIG.factionIds.incomingFactionId;
    const myFactionId = document.getElementById('myFactionId').value || CONFIG.factionIds.myFactionId;
    
    // Generate config links with custom faction IDs
    const configLinks = {
        'Production': 'page=nukes/view=production',
        'Incoming': `page=faction/fid=${incomingFactionId}/view=incoming`,
        'Target': `page=faction/fid=${enemyFactionId}/view=nations/start=0`,
        'Launch': 'page=nukes/view=targets',
        'Join': `page=faction/fid=${myFactionId}?consider_join_faction=1&join_faction=1`
    };
    
    // Generate HTML file
    let htmlContent = `<!doctype html>
<html>
<head>
<style>
table {
    border-collapse: collapse;
    width: ${customisation.tableWidth}%;
    margin: 20px auto;
    background-color: ${customisation.bgColor};
    border: ${customisation.borderWidth}px solid ${customisation.borderColor};
    border-radius: ${customisation.borderRadius}px;
    color: ${customisation.textColor};
    text-align: left;
    font-family: ${customisation.fontFamily};
    font-size: ${customisation.fontSize}px;
    opacity: ${customisation.opacity};
    ${customisation.enableShadows ? 'box-shadow: 0 4px 8px rgba(0,0,0,0.3);' : ''}
}
th, td {
    padding: ${customisation.cellPadding}px;
    border-bottom: ${customisation.borderWidth}px solid ${customisation.borderColor};
}
th {
    background-color: ${customisation.headerBgColor};
    color: ${customisation.headerTextColor};
    font-size: ${customisation.headerFontSize}px;
    font-weight: ${customisation.fontWeight};
}
tr:hover {
    background-color: ${customisation.hoverColor};
}
td a {
    text-decoration: none;
    color: ${customisation.textColor};
}
td a:visited {
    color: #ccc;
}
body {
    text-align: center;
    background-color: rgb(37, 37, 37);
    color: white;
    padding-top: 50px;
}
.speciality-S { color: ${customisation.strategicColor}; }
.speciality-M { color: ${customisation.militaryColor}; }
.speciality-C { color: ${customisation.cleanupColor}; }
.speciality-E { color: ${customisation.economicColor}; }
.speciality-U { color: ${customisation.unknownColor}; }
</style>
</head>
<body>
<table>
<thead>
<tr>
    <th>Nation</th>
    <th>Speciality</th>`;
    
    // Add dynamic columns from config
    for (const [key, value] of Object.entries(configLinks)) {
        htmlContent += `
    <th>${key}</th>`;
    }
    
    htmlContent += `
</tr>
</thead>
<tbody>
`;
    
    for (const specialty of sortingOrder) {
        for (const nation of sortedNations[specialty] || []) {
            const specialtyClass = getSpecialtyClass(specialty);
            const specialtyName = getSpecialtyName(specialty);
            const specialtyColor = getSpecialtyColor(specialty);
            const canonical = nation.toLowerCase().replace(/\s+/g, '_');
            const containerPrefix = `container=${canonical}/nation=${canonical}`;
            
            htmlContent += `<tr>
    <td><a target="_blank" href="https://www.nationstates.net/${containerPrefix}/nation=${canonical}?generated_by=cat_nuke_thing_by_catiania_used_by_${mainNation}">${nation}</a></td>
    <td class="${specialtyClass}">${specialtyName}</td>`;
            
            // Add dynamic columns from config
            for (const [key, value] of Object.entries(configLinks)) {
                htmlContent += `
    <td><a target="_blank" href="https://www.nationstates.net/${containerPrefix}/${value}?generated_by=cat_nuke_thing_by_catiania_used_by_${mainNation}">${key}</a></td>`;
            }
            
            htmlContent += `
</tr>
`;
        }
    }
    
    htmlContent += `</tbody>
</table>
</body>
</html>`;
    
    // Generate container rules
    let containerRules = '';
    let nationRules = '';
    
    for (const specialty of sortingOrder) {
        for (const nation of sortedNations[specialty] || []) {
            const canonical = nation.toLowerCase().replace(/\s+/g, '_');
            const escapedCanonical = canonical.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            
            containerRules += `@^.*\\.nationstates\\.net/(.*/)?container=${escapedCanonical}(/.*)?$ , ${nation}\n`;
            nationRules += `@^.*\\.nationstates\\.net/(.*/)?nation=${escapedCanonical}(/.*)?$ , ${nation}\n`;
        }
    }
    
    // Generate cache CSV
    let cacheCsv = '';
    for (const [nation, specialty] of Object.entries(cache)) {
        cacheCsv += `${nation},${specialty}\n`;
    }
    
    // Create download links
    const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
    const containerBlob = new Blob([containerRules], { type: 'text/plain' });
    const nationBlob = new Blob([nationRules], { type: 'text/plain' });
    const cacheBlob = new Blob([cacheCsv], { type: 'text/csv' });
    
    document.getElementById('downloadHtml').href = URL.createObjectURL(htmlBlob);
    document.getElementById('downloadContainer').href = URL.createObjectURL(containerBlob);
    document.getElementById('downloadNation').href = URL.createObjectURL(nationBlob);
    document.getElementById('downloadCache').href = URL.createObjectURL(cacheBlob);
}

// Clear all data
function clearAll() {
    document.getElementById('puppetsList').value = '';
    document.getElementById('mainNation').value = '';
    document.getElementById('sortingOrder').value = 'MSCEU';
    document.getElementById('results').classList.add('hidden');
    hideStatus();
}

// Add event listeners for real-time preview updates
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to all customisation controls
    const controls = [
        'bgColor', 'borderColor', 'headerBgColor', 'headerTextColor', 'hoverColor', 'textColor',
        'militaryColor', 'strategicColor', 'cleanupColor', 'economicColor', 'unknownColor',
        'tableWidth', 'cellPadding', 'borderWidth', 'borderRadius', 'fontSize', 'headerFontSize',
        'enableHover', 'enableStripes', 'enableShadows', 'enableGradient', 'opacity',
        'enemyFactionId', 'incomingFactionId', 'myFactionId'
    ];
    
    controls.forEach(controlId => {
        const element = document.getElementById(controlId);
        if (element) {
            element.addEventListener('input', updatePreview);
            element.addEventListener('change', updatePreview);
        }
    });
    
    // Add event listener for puppets list changes
    document.getElementById('puppetsList').addEventListener('input', updatePreview);
    
    // Initialize range value displays
    updateRangeValues();
    
    // Add event listeners for range inputs to update their display values
    const rangeInputs = ['tableWidth', 'cellPadding', 'borderWidth', 'borderRadius', 'fontSize', 'headerFontSize', 'opacity'];
    rangeInputs.forEach(inputId => {
        const element = document.getElementById(inputId);
        if (element) {
            element.addEventListener('input', updateRangeValues);
        }
    });
    
    // Initialize
    loadCache();
});
