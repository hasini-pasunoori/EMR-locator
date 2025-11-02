/**
 * EMResource Network Diagram Generator
 * Creates visual network diagrams showing component relationships
 */

const fs = require('fs');
const path = require('path');

class NetworkDiagramGenerator {
    constructor() {
        this.components = this.defineComponents();
        this.connections = this.defineConnections();
    }

    defineComponents() {
        return {
            // Frontend Components
            'landing_page': { type: 'frontend', name: 'Landing Page', file: 'views/index.ejs' },
            'dashboard': { type: 'frontend', name: 'User Dashboard', file: 'views/dashboard.ejs' },
            'resource_finder': { type: 'frontend', name: 'Resource Finder', file: 'views/resource.ejs' },
            'donor_page': { type: 'frontend', name: 'Donor Registration', file: 'views/donor.ejs' },
            'admin_panel': { type: 'frontend', name: 'Admin Panel', file: 'views/admin.ejs' },
            'hospital_dashboard': { type: 'frontend', name: 'Hospital Dashboard', file: 'views/hospital-dashboard.ejs' },
            
            // Backend Routes
            'auth_routes': { type: 'backend', name: 'Authentication Routes', file: 'routes/auth.js' },
            'facility_routes': { type: 'backend', name: 'Facility Routes', file: 'routes/facilities.js' },
            'donor_routes': { type: 'backend', name: 'Donor Routes', file: 'routes/donors.js' },
            'emergency_routes': { type: 'backend', name: 'Emergency Routes', file: 'routes/emergency.js' },
            'admin_routes': { type: 'backend', name: 'Admin Routes', file: 'routes/admin.js' },
            'hospital_routes': { type: 'backend', name: 'Hospital Routes', file: 'routes/hospital.js' },
            'chat_routes': { type: 'backend', name: 'Chat Routes', file: 'routes/chat.js' },
            
            // Database Models
            'user_model': { type: 'database', name: 'User Model', file: 'models/User.js' },
            'facility_model': { type: 'database', name: 'Medical Facility Model', file: 'models/MedicalFacility.js' },
            'donor_model': { type: 'database', name: 'Blood Donor Model', file: 'models/BloodDonor.js' },
            'emergency_model': { type: 'database', name: 'Emergency Request Model', file: 'models/EmergencyRequest.js' },
            'chat_model': { type: 'database', name: 'Chat Model', file: 'models/Chat.js' },
            'otp_model': { type: 'database', name: 'OTP Model', file: 'models/OTP.js' },
            
            // Configuration & Services
            'passport_config': { type: 'config', name: 'Passport Config', file: 'config/passport.js' },
            'email_service': { type: 'config', name: 'Email Service', file: 'config/emailService.js' },
            'gcp_apis': { type: 'config', name: 'Google Cloud APIs', file: 'config/gcp-apis.js' },
            
            // External Services
            'mongodb': { type: 'external', name: 'MongoDB Atlas', file: 'external' },
            'google_maps': { type: 'external', name: 'Google Maps API', file: 'external' },
            'google_oauth': { type: 'external', name: 'Google OAuth', file: 'external' },
            'email_smtp': { type: 'external', name: 'Email SMTP', file: 'external' }
        };
    }

    defineConnections() {
        return [
            // Frontend to Backend connections
            { from: 'landing_page', to: 'auth_routes', type: 'http' },
            { from: 'dashboard', to: 'facility_routes', type: 'http' },
            { from: 'dashboard', to: 'emergency_routes', type: 'http' },
            { from: 'resource_finder', to: 'facility_routes', type: 'http' },
            { from: 'resource_finder', to: 'donor_routes', type: 'http' },
            { from: 'donor_page', to: 'donor_routes', type: 'http' },
            { from: 'admin_panel', to: 'admin_routes', type: 'http' },
            { from: 'hospital_dashboard', to: 'hospital_routes', type: 'http' },
            
            // Backend to Database connections
            { from: 'auth_routes', to: 'user_model', type: 'mongoose' },
            { from: 'auth_routes', to: 'otp_model', type: 'mongoose' },
            { from: 'facility_routes', to: 'facility_model', type: 'mongoose' },
            { from: 'donor_routes', to: 'donor_model', type: 'mongoose' },
            { from: 'emergency_routes', to: 'emergency_model', type: 'mongoose' },
            { from: 'emergency_routes', to: 'donor_model', type: 'mongoose' },
            { from: 'chat_routes', to: 'chat_model', type: 'mongoose' },
            { from: 'admin_routes', to: 'user_model', type: 'mongoose' },
            { from: 'admin_routes', to: 'facility_model', type: 'mongoose' },
            { from: 'hospital_routes', to: 'facility_model', type: 'mongoose' },
            
            // Configuration connections
            { from: 'auth_routes', to: 'passport_config', type: 'import' },
            { from: 'auth_routes', to: 'email_service', type: 'import' },
            { from: 'resource_finder', to: 'gcp_apis', type: 'import' },
            
            // Database to External connections
            { from: 'user_model', to: 'mongodb', type: 'connection' },
            { from: 'facility_model', to: 'mongodb', type: 'connection' },
            { from: 'donor_model', to: 'mongodb', type: 'connection' },
            { from: 'emergency_model', to: 'mongodb', type: 'connection' },
            { from: 'chat_model', to: 'mongodb', type: 'connection' },
            { from: 'otp_model', to: 'mongodb', type: 'connection' },
            
            // External service connections
            { from: 'passport_config', to: 'google_oauth', type: 'api' },
            { from: 'email_service', to: 'email_smtp', type: 'smtp' },
            { from: 'gcp_apis', to: 'google_maps', type: 'api' },
            { from: 'resource_finder', to: 'google_maps', type: 'javascript' }
        ];
    }

    generateD3NetworkDiagram() {
        const nodes = Object.entries(this.components).map(([id, component]) => ({
            id,
            name: component.name,
            type: component.type,
            file: component.file
        }));

        const links = this.connections.map(conn => ({
            source: conn.from,
            target: conn.to,
            type: conn.type
        }));

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EMResource - Network Diagram</title>
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .controls { background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        .network-container { background: white; border-radius: 8px; padding: 20px; }
        .node { cursor: pointer; }
        .node-frontend { fill: #3498db; }
        .node-backend { fill: #e74c3c; }
        .node-database { fill: #2ecc71; }
        .node-config { fill: #f39c12; }
        .node-external { fill: #9b59b6; }
        .link { stroke: #999; stroke-opacity: 0.6; }
        .link-http { stroke: #3498db; stroke-width: 2px; }
        .link-mongoose { stroke: #2ecc71; stroke-width: 2px; }
        .link-import { stroke: #f39c12; stroke-width: 1.5px; }
        .link-connection { stroke: #e74c3c; stroke-width: 2px; }
        .link-api { stroke: #9b59b6; stroke-width: 1.5px; }
        .link-smtp { stroke: #34495e; stroke-width: 1.5px; }
        .link-javascript { stroke: #f1c40f; stroke-width: 1.5px; }
        .node-label { font-size: 12px; text-anchor: middle; pointer-events: none; }
        .legend { position: absolute; top: 20px; right: 20px; background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .legend-item { display: flex; align-items: center; margin: 5px 0; }
        .legend-color { width: 20px; height: 20px; margin-right: 10px; border-radius: 3px; }
        .tooltip { position: absolute; background: rgba(0,0,0,0.8); color: white; padding: 8px; border-radius: 4px; font-size: 12px; pointer-events: none; opacity: 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🏥 EMResource - Component Network Diagram</h1>
        
        <div class="controls">
            <button onclick="resetSimulation()">Reset Layout</button>
            <button onclick="toggleLabels()">Toggle Labels</button>
            <label>
                <input type="range" id="linkDistance" min="50" max="200" value="100" onchange="updateLinkDistance(this.value)">
                Link Distance: <span id="linkDistanceValue">100</span>
            </label>
        </div>
        
        <div class="network-container">
            <svg id="network" width="1160" height="800"></svg>
        </div>
        
        <div class="legend">
            <h3>Component Types</h3>
            <div class="legend-item"><div class="legend-color node-frontend"></div>Frontend (Views)</div>
            <div class="legend-item"><div class="legend-color node-backend"></div>Backend (Routes)</div>
            <div class="legend-item"><div class="legend-color node-database"></div>Database (Models)</div>
            <div class="legend-item"><div class="legend-color node-config"></div>Configuration</div>
            <div class="legend-item"><div class="legend-color node-external"></div>External Services</div>
        </div>
    </div>
    
    <div class="tooltip" id="tooltip"></div>

    <script>
        const nodes = ${JSON.stringify(nodes, null, 2)};
        const links = ${JSON.stringify(links, null, 2)};
        
        const svg = d3.select("#network");
        const width = +svg.attr("width");
        const height = +svg.attr("height");
        
        let showLabels = true;
        let linkDistance = 100;
        
        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(linkDistance))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collision", d3.forceCollide().radius(30));
        
        const link = svg.append("g")
            .selectAll("line")
            .data(links)
            .enter().append("line")
            .attr("class", d => \`link link-\${d.type}\`);
        
        const node = svg.append("g")
            .selectAll("g")
            .data(nodes)
            .enter().append("g")
            .attr("class", "node")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));
        
        node.append("circle")
            .attr("r", 20)
            .attr("class", d => \`node-\${d.type}\`)
            .on("mouseover", showTooltip)
            .on("mouseout", hideTooltip);
        
        const labels = node.append("text")
            .attr("class", "node-label")
            .attr("dy", 35)
            .text(d => d.name.length > 15 ? d.name.substring(0, 15) + "..." : d.name);
        
        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
            
            node.attr("transform", d => \`translate(\${d.x},\${d.y})\`);
        });
        
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        
        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }
        
        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
        
        function showTooltip(event, d) {
            const tooltip = d3.select("#tooltip");
            tooltip.style("opacity", 1)
                .html(\`<strong>\${d.name}</strong><br/>Type: \${d.type}<br/>File: \${d.file}\`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
        }
        
        function hideTooltip() {
            d3.select("#tooltip").style("opacity", 0);
        }
        
        function resetSimulation() {
            simulation.alpha(1).restart();
        }
        
        function toggleLabels() {
            showLabels = !showLabels;
            labels.style("opacity", showLabels ? 1 : 0);
        }
        
        function updateLinkDistance(value) {
            linkDistance = +value;
            document.getElementById("linkDistanceValue").textContent = value;
            simulation.force("link").distance(linkDistance);
            simulation.alpha(1).restart();
        }
    </script>
</body>
</html>`;
    }

    generateMermaidArchitecture() {
        return `
# EMResource Architecture Diagram

## System Overview
\`\`\`mermaid
graph TB
    subgraph "Frontend Layer"
        LP[Landing Page]
        DB[Dashboard]
        RF[Resource Finder]
        DP[Donor Page]
        AP[Admin Panel]
        HP[Hospital Dashboard]
    end
    
    subgraph "Backend Layer"
        AR[Auth Routes]
        FR[Facility Routes]
        DR[Donor Routes]
        ER[Emergency Routes]
        ADR[Admin Routes]
        HR[Hospital Routes]
        CR[Chat Routes]
    end
    
    subgraph "Database Layer"
        UM[User Model]
        FM[Facility Model]
        DOM[Donor Model]
        EM[Emergency Model]
        CM[Chat Model]
        OM[OTP Model]
    end
    
    subgraph "External Services"
        MA[MongoDB Atlas]
        GM[Google Maps]
        GO[Google OAuth]
        ES[Email SMTP]
    end
    
    LP --> AR
    DB --> FR
    DB --> ER
    RF --> FR
    RF --> DR
    DP --> DR
    AP --> ADR
    HP --> HR
    
    AR --> UM
    AR --> OM
    FR --> FM
    DR --> DOM
    ER --> EM
    CR --> CM
    ADR --> UM
    HR --> FM
    
    UM --> MA
    FM --> MA
    DOM --> MA
    EM --> MA
    CM --> MA
    OM --> MA
    
    AR --> GO
    AR --> ES
    RF --> GM
\`\`\`

## Authentication Flow
\`\`\`mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as Auth Routes
    participant E as Email Service
    participant D as Database
    
    U->>F: Enter credentials
    F->>A: POST /auth/signin/send-otp
    A->>D: Validate user
    A->>E: Send OTP email
    E->>U: OTP email
    U->>F: Enter OTP
    F->>A: POST /auth/signin/verify-otp
    A->>D: Verify OTP
    A->>F: Create session
    F->>U: Redirect to dashboard
\`\`\`

## Resource Discovery Flow
\`\`\`mermaid
sequenceDiagram
    participant U as User
    participant R as Resource Finder
    participant F as Facility Routes
    participant D as Database
    participant G as Google Maps
    
    U->>R: Search for facilities
    R->>G: Get user location
    R->>F: GET /api/facilities/nearby
    F->>D: Geospatial query
    D->>F: Return facilities
    F->>R: Facility data
    R->>G: Display on map
    G->>U: Show results
\`\`\`
`;
    }

    saveNetworkDiagram() {
        const d3Diagram = this.generateD3NetworkDiagram();
        const mermaidDiagram = this.generateMermaidArchitecture();
        
        const d3Path = path.join(__dirname, 'network-diagram.html');
        const mermaidPath = path.join(__dirname, 'ARCHITECTURE_DIAGRAMS.md');
        
        fs.writeFileSync(d3Path, d3Diagram);
        fs.writeFileSync(mermaidPath, mermaidDiagram);
        
        console.log(`✅ Interactive network diagram saved to: ${d3Path}`);
        console.log(`✅ Architecture diagrams saved to: ${mermaidPath}`);
    }
}

// Run if executed directly
if (require.main === module) {
    const generator = new NetworkDiagramGenerator();
    generator.saveNetworkDiagram();
}

module.exports = NetworkDiagramGenerator;