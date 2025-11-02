/**
 * EMResource Data Flow Visualizer
 * Generates interactive data flow diagrams for the application
 */

const fs = require('fs');
const path = require('path');

class DataFlowVisualizer {
    constructor() {
        this.flows = {
            authentication: this.getAuthenticationFlow(),
            resourceDiscovery: this.getResourceDiscoveryFlow(),
            emergencyRequest: this.getEmergencyRequestFlow(),
            roleBasedAccess: this.getRoleBasedAccessFlow(),
            databaseOperations: this.getDatabaseOperationsFlow()
        };
    }

    getAuthenticationFlow() {
        return {
            name: "Authentication Flow",
            steps: [
                {
                    id: "user_input",
                    name: "User Input",
                    description: "Email, Password, Role selection",
                    file: "views/index.ejs",
                    next: ["validation"]
                },
                {
                    id: "validation",
                    name: "Input Validation",
                    description: "express-validator checks",
                    file: "routes/auth.js",
                    next: ["user_lookup"]
                },
                {
                    id: "user_lookup",
                    name: "User Lookup",
                    description: "Find user in MongoDB",
                    file: "models/User.js",
                    next: ["password_check"]
                },
                {
                    id: "password_check",
                    name: "Password Verification",
                    description: "bcrypt comparison",
                    file: "models/User.js",
                    next: ["role_check"]
                },
                {
                    id: "role_check",
                    name: "Role Verification",
                    description: "Check user role matches request",
                    file: "routes/auth.js",
                    next: ["otp_generation"]
                },
                {
                    id: "otp_generation",
                    name: "OTP Generation",
                    description: "Generate 6-digit OTP",
                    file: "routes/auth.js",
                    next: ["email_send"]
                },
                {
                    id: "email_send",
                    name: "Email OTP",
                    description: "Send OTP via Nodemailer",
                    file: "config/emailService.js",
                    next: ["otp_verification"]
                },
                {
                    id: "otp_verification",
                    name: "OTP Verification",
                    description: "Verify submitted OTP",
                    file: "routes/auth.js",
                    next: ["session_creation"]
                },
                {
                    id: "session_creation",
                    name: "Session Creation",
                    description: "Create user session",
                    file: "config/passport.js",
                    next: ["role_redirect"]
                },
                {
                    id: "role_redirect",
                    name: "Role-based Redirect",
                    description: "Redirect to appropriate dashboard",
                    file: "routes/auth.js",
                    next: []
                }
            ]
        };
    }

    getResourceDiscoveryFlow() {
        return {
            name: "Resource Discovery Flow",
            steps: [
                {
                    id: "location_input",
                    name: "Location Input",
                    description: "GPS coordinates or address",
                    file: "views/resource.ejs",
                    next: ["geocoding"]
                },
                {
                    id: "geocoding",
                    name: "Geocoding",
                    description: "Convert address to coordinates",
                    file: "public/js/resource.js",
                    next: ["geospatial_query"]
                },
                {
                    id: "geospatial_query",
                    name: "Geospatial Query",
                    description: "MongoDB $near query with radius",
                    file: "routes/facilities.js",
                    next: ["distance_calculation"]
                },
                {
                    id: "distance_calculation",
                    name: "Distance Calculation",
                    description: "Calculate distances using Haversine formula",
                    file: "routes/facilities.js",
                    next: ["results_sorting"]
                },
                {
                    id: "results_sorting",
                    name: "Results Sorting",
                    description: "Sort by distance and availability",
                    file: "routes/facilities.js",
                    next: ["map_rendering"]
                },
                {
                    id: "map_rendering",
                    name: "Map Rendering",
                    description: "Display results on Google Maps",
                    file: "views/resource.ejs",
                    next: []
                }
            ]
        };
    }

    getEmergencyRequestFlow() {
        return {
            name: "Emergency Request Flow",
            steps: [
                {
                    id: "emergency_input",
                    name: "Emergency Input",
                    description: "Blood type, urgency, location",
                    file: "views/dashboard.ejs",
                    next: ["request_validation"]
                },
                {
                    id: "request_validation",
                    name: "Request Validation",
                    description: "Validate emergency request data",
                    file: "routes/emergency.js",
                    next: ["donor_search"]
                },
                {
                    id: "donor_search",
                    name: "Donor Search",
                    description: "Find compatible donors nearby",
                    file: "routes/donors.js",
                    next: ["notification_send"]
                },
                {
                    id: "notification_send",
                    name: "Send Notifications",
                    description: "Email/SMS to potential donors",
                    file: "config/emailService.js",
                    next: ["response_tracking"]
                },
                {
                    id: "response_tracking",
                    name: "Response Tracking",
                    description: "Track donor responses",
                    file: "routes/emergency.js",
                    next: ["chat_initiation"]
                },
                {
                    id: "chat_initiation",
                    name: "Chat Initiation",
                    description: "Enable communication between parties",
                    file: "routes/chat.js",
                    next: []
                }
            ]
        };
    }

    getRoleBasedAccessFlow() {
        return {
            name: "Role-Based Access Control",
            roles: {
                user: {
                    name: "Regular User",
                    permissions: ["view_resources", "create_requests", "chat"],
                    dashboard: "/dashboard",
                    routes: ["/resource", "/requests", "/chat"]
                },
                donor: {
                    name: "Blood Donor",
                    permissions: ["view_resources", "respond_requests", "manage_profile"],
                    dashboard: "/donor/dashboard",
                    routes: ["/donor", "/responses", "/chat"]
                },
                hospital: {
                    name: "Hospital Staff",
                    permissions: ["manage_facility", "update_beds", "view_analytics"],
                    dashboard: "/hospital/dashboard",
                    routes: ["/hospital", "/beds", "/analytics"]
                },
                admin: {
                    name: "System Administrator",
                    permissions: ["manage_users", "verify_facilities", "system_analytics"],
                    dashboard: "/admin/dashboard",
                    routes: ["/admin", "/analytics", "/users"]
                }
            }
        };
    }

    getDatabaseOperationsFlow() {
        return {
            name: "Database Operations Flow",
            collections: {
                users: {
                    model: "User.js",
                    indexes: ["email", "location (2dsphere)"],
                    operations: ["create", "authenticate", "update_profile"]
                },
                medicalfacilities: {
                    model: "MedicalFacility.js",
                    indexes: ["location (2dsphere)", "type", "address.city"],
                    operations: ["geospatial_search", "capacity_update", "verification"]
                },
                blooddonors: {
                    model: "BloodDonor.js",
                    indexes: ["location (2dsphere)", "bloodType", "availability"],
                    operations: ["donor_search", "availability_update", "response_tracking"]
                },
                emergencyrequests: {
                    model: "EmergencyRequest.js",
                    indexes: ["location (2dsphere)", "bloodType", "status"],
                    operations: ["create_request", "match_donors", "status_update"]
                },
                chats: {
                    model: "Chat.js",
                    indexes: ["participants", "createdAt"],
                    operations: ["send_message", "get_conversations", "mark_read"]
                }
            }
        };
    }

    generateMermaidDiagram(flowName) {
        const flow = this.flows[flowName];
        if (!flow || !flow.steps) return '';

        let mermaid = `graph TD\n`;
        
        flow.steps.forEach(step => {
            mermaid += `    ${step.id}["${step.name}<br/>${step.description}"]\n`;
        });

        flow.steps.forEach(step => {
            step.next.forEach(nextId => {
                mermaid += `    ${step.id} --> ${nextId}\n`;
            });
        });

        return mermaid;
    }

    generateHTMLVisualization() {
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EMResource - Data Flow Visualization</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .flow-section { margin: 30px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .flow-title { color: #2c3e50; font-size: 24px; margin-bottom: 15px; }
        .mermaid { text-align: center; margin: 20px 0; }
        .file-reference { background: #f8f9fa; padding: 10px; border-radius: 4px; margin: 10px 0; }
        .role-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; }
        .role-card { background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #007bff; }
    </style>
</head>
<body>
    <h1>🏥 EMResource - Data Flow Visualization</h1>
    
    <div class="flow-section">
        <h2 class="flow-title">🔐 Authentication Flow</h2>
        <div class="mermaid">
            ${this.generateMermaidDiagram('authentication')}
        </div>
        <div class="file-reference">
            <strong>Key Files:</strong> routes/auth.js, config/passport.js, models/User.js, config/emailService.js
        </div>
    </div>

    <div class="flow-section">
        <h2 class="flow-title">🔍 Resource Discovery Flow</h2>
        <div class="mermaid">
            ${this.generateMermaidDiagram('resourceDiscovery')}
        </div>
        <div class="file-reference">
            <strong>Key Files:</strong> routes/facilities.js, views/resource.ejs, models/MedicalFacility.js
        </div>
    </div>

    <div class="flow-section">
        <h2 class="flow-title">🚨 Emergency Request Flow</h2>
        <div class="mermaid">
            ${this.generateMermaidDiagram('emergencyRequest')}
        </div>
        <div class="file-reference">
            <strong>Key Files:</strong> routes/emergency.js, routes/donors.js, routes/chat.js, config/emailService.js
        </div>
    </div>

    <div class="flow-section">
        <h2 class="flow-title">👥 Role-Based Access Control</h2>
        <div class="role-grid">
            ${Object.entries(this.flows.roleBasedAccess.roles).map(([key, role]) => `
                <div class="role-card">
                    <h3>${role.name}</h3>
                    <p><strong>Dashboard:</strong> ${role.dashboard}</p>
                    <p><strong>Permissions:</strong></p>
                    <ul>
                        ${role.permissions.map(perm => `<li>${perm.replace('_', ' ')}</li>`).join('')}
                    </ul>
                    <p><strong>Routes:</strong> ${role.routes.join(', ')}</p>
                </div>
            `).join('')}
        </div>
    </div>

    <div class="flow-section">
        <h2 class="flow-title">🗄️ Database Collections & Operations</h2>
        ${Object.entries(this.flows.databaseOperations.collections).map(([name, collection]) => `
            <div class="role-card">
                <h3>${name.toUpperCase()}</h3>
                <p><strong>Model:</strong> models/${collection.model}</p>
                <p><strong>Indexes:</strong> ${collection.indexes.join(', ')}</p>
                <p><strong>Operations:</strong> ${collection.operations.join(', ')}</p>
            </div>
        `).join('')}
    </div>

    <script>
        mermaid.initialize({ startOnLoad: true, theme: 'default' });
    </script>
</body>
</html>`;
        return html;
    }

    generateRouteMap() {
        return {
            authentication: {
                prefix: '/auth',
                routes: [
                    'POST /signup/send-otp',
                    'POST /signup/verify-otp',
                    'POST /signin/send-otp',
                    'POST /signin/verify-otp',
                    'GET /google',
                    'GET /google/callback',
                    'POST /logout'
                ]
            },
            facilities: {
                prefix: '/api/facilities',
                routes: [
                    'GET /nearby',
                    'GET /',
                    'POST /',
                    'PUT /:id',
                    'DELETE /:id'
                ]
            },
            donors: {
                prefix: '/api/donors',
                routes: [
                    'GET /nearby',
                    'POST /register',
                    'GET /profile',
                    'PATCH /availability'
                ]
            },
            emergency: {
                prefix: '/api/emergency',
                routes: [
                    'POST /request',
                    'GET /nearby',
                    'POST /:id/respond',
                    'GET /stats/overview'
                ]
            },
            pages: {
                prefix: '/',
                routes: [
                    'GET /',
                    'GET /dashboard',
                    'GET /resource',
                    'GET /donor',
                    'GET /admin',
                    'GET /hospital',
                    'GET /beds',
                    'GET /chat'
                ]
            }
        };
    }

    saveVisualization() {
        const html = this.generateHTMLVisualization();
        const outputPath = path.join(__dirname, 'data-flow-visualization.html');
        fs.writeFileSync(outputPath, html);
        console.log(`✅ Data flow visualization saved to: ${outputPath}`);
        
        const routeMap = this.generateRouteMap();
        const routeMapPath = path.join(__dirname, 'route-map.json');
        fs.writeFileSync(routeMapPath, JSON.stringify(routeMap, null, 2));
        console.log(`✅ Route map saved to: ${routeMapPath}`);
    }
}

// Generate visualization if run directly
if (require.main === module) {
    const visualizer = new DataFlowVisualizer();
    visualizer.saveVisualization();
}

module.exports = DataFlowVisualizer;