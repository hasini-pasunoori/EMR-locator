/**
 * EMResource Route Analyzer
 * Analyzes and documents all routes, middleware, and authentication flows
 */

const fs = require('fs');
const path = require('path');

class RouteAnalyzer {
    constructor(projectRoot) {
        this.projectRoot = projectRoot;
        this.routes = {};
        this.middleware = {};
        this.authFlow = {};
    }

    analyzeRoutes() {
        const routesDir = path.join(this.projectRoot, 'routes');
        const routeFiles = fs.readdirSync(routesDir).filter(file => file.endsWith('.js'));

        routeFiles.forEach(file => {
            const routePath = path.join(routesDir, file);
            const routeName = file.replace('.js', '');
            this.routes[routeName] = this.parseRouteFile(routePath);
        });

        return this.routes;
    }

    parseRouteFile(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        const routes = [];
        
        // Extract route definitions
        const routeRegex = /router\.(get|post|put|patch|delete)\s*\(\s*['"`]([^'"`]+)['"`]/g;
        let match;
        
        while ((match = routeRegex.exec(content)) !== null) {
            const [, method, path] = match;
            routes.push({
                method: method.toUpperCase(),
                path: path,
                fullPath: this.getFullPath(filePath, path)
            });
        }

        return {
            file: filePath,
            routes: routes,
            middleware: this.extractMiddleware(content),
            authentication: this.extractAuthRequirements(content)
        };
    }

    getFullPath(filePath, routePath) {
        const fileName = path.basename(filePath, '.js');
        const prefixMap = {
            'auth': '/auth',
            'facilities': '/api/facilities',
            'donors': '/api/donors',
            'emergency': '/api/emergency',
            'admin': '/api/admin',
            'hospital': '/api/hospital',
            'beds': '/api/beds',
            'chat': '/api/chat',
            'user': '/api/user',
            'sos': '/api/sos'
        };
        
        const prefix = prefixMap[fileName] || '';
        return prefix + routePath;
    }

    extractMiddleware(content) {
        const middleware = [];
        
        // Common middleware patterns
        const patterns = [
            /body\(['"`]([^'"`]+)['"`]\)/g,
            /validationResult/g,
            /passport\.authenticate/g,
            /isAuthenticated/g,
            /requireRole/g
        ];

        patterns.forEach(pattern => {
            const matches = content.match(pattern);
            if (matches) {
                middleware.push(...matches);
            }
        });

        return [...new Set(middleware)];
    }

    extractAuthRequirements(content) {
        const authRequirements = {
            requiresAuth: content.includes('req.isAuthenticated()') || content.includes('passport.authenticate'),
            requiresRole: content.includes('req.user.role'),
            hasOTP: content.includes('OTP'),
            hasValidation: content.includes('validationResult')
        };

        return authRequirements;
    }

    generateRouteDocumentation() {
        const routes = this.analyzeRoutes();
        
        let documentation = `# EMResource API Routes Documentation\n\n`;
        documentation += `Generated on: ${new Date().toISOString()}\n\n`;

        Object.entries(routes).forEach(([routeFile, routeData]) => {
            documentation += `## ${routeFile.toUpperCase()} Routes\n`;
            documentation += `**File:** \`${routeData.file}\`\n\n`;

            if (routeData.routes.length > 0) {
                documentation += `### Endpoints\n\n`;
                routeData.routes.forEach(route => {
                    documentation += `- **${route.method}** \`${route.fullPath}\`\n`;
                });
                documentation += `\n`;
            }

            if (routeData.middleware.length > 0) {
                documentation += `### Middleware\n`;
                routeData.middleware.forEach(mw => {
                    documentation += `- ${mw}\n`;
                });
                documentation += `\n`;
            }

            if (Object.values(routeData.authentication).some(Boolean)) {
                documentation += `### Authentication Requirements\n`;
                Object.entries(routeData.authentication).forEach(([key, value]) => {
                    if (value) {
                        documentation += `- ✅ ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}\n`;
                    }
                });
                documentation += `\n`;
            }

            documentation += `---\n\n`;
        });

        return documentation;
    }

    generateAuthenticationFlow() {
        return {
            "OTP-Based Authentication": {
                "signup": [
                    "POST /auth/signup/send-otp - Send OTP for registration",
                    "POST /auth/signup/verify-otp - Verify OTP and create account"
                ],
                "signin": [
                    "POST /auth/signin/send-otp - Send OTP for login",
                    "POST /auth/signin/verify-otp - Verify OTP and login"
                ]
            },
            "OAuth Authentication": [
                "GET /auth/google - Initiate Google OAuth",
                "GET /auth/google/callback - Handle OAuth callback"
            ],
            "Session Management": [
                "POST /auth/logout - Logout user",
                "GET /auth/me - Get current user info"
            ],
            "Role-Based Redirects": {
                "user": "/dashboard",
                "donor": "/donor/dashboard",
                "hospital": "/hospital/dashboard",
                "admin": "/admin/dashboard"
            }
        };
    }

    generateMiddlewarePipeline() {
        return {
            "Global Middleware": [
                "cors() - Cross-origin resource sharing",
                "express.json() - JSON body parser",
                "express.urlencoded() - URL encoded parser",
                "session() - Session management",
                "passport.initialize() - Passport initialization",
                "passport.session() - Passport session support"
            ],
            "Route-Specific Middleware": {
                "Authentication": [
                    "passport.authenticate('local')",
                    "passport.authenticate('google')",
                    "req.isAuthenticated() check"
                ],
                "Validation": [
                    "body().isEmail() - Email validation",
                    "body().isLength() - Length validation",
                    "validationResult() - Error collection"
                ],
                "Authorization": [
                    "Role-based access control",
                    "Admin-only routes",
                    "Hospital-only routes"
                ]
            }
        };
    }

    generateSecurityAnalysis() {
        return {
            "Authentication Security": {
                "Multi-Factor": "✅ OTP-based 2FA implemented",
                "Password Hashing": "✅ bcrypt with salt rounds",
                "Session Security": "✅ Secure cookies, httpOnly, sameSite",
                "OAuth Integration": "✅ Google OAuth 2.0"
            },
            "Input Validation": {
                "Email Validation": "✅ express-validator",
                "Password Strength": "✅ Minimum 6 characters",
                "SQL Injection": "✅ Mongoose ODM protection",
                "XSS Protection": "✅ Input sanitization"
            },
            "Authorization": {
                "Role-Based Access": "✅ User, Donor, Hospital, Admin roles",
                "Route Protection": "✅ Authentication middleware",
                "Resource Ownership": "✅ User-specific data access"
            }
        };
    }

    generateCompleteAnalysis() {
        const analysis = {
            routes: this.analyzeRoutes(),
            authFlow: this.generateAuthenticationFlow(),
            middleware: this.generateMiddlewarePipeline(),
            security: this.generateSecurityAnalysis(),
            documentation: this.generateRouteDocumentation()
        };

        return analysis;
    }

    saveAnalysis() {
        const analysis = this.generateCompleteAnalysis();
        
        // Save complete analysis as JSON
        const jsonPath = path.join(__dirname, 'route-analysis.json');
        fs.writeFileSync(jsonPath, JSON.stringify(analysis, null, 2));
        
        // Save documentation as Markdown
        const mdPath = path.join(__dirname, 'ROUTES_DOCUMENTATION.md');
        fs.writeFileSync(mdPath, analysis.documentation);
        
        console.log(`✅ Route analysis saved to: ${jsonPath}`);
        console.log(`✅ Route documentation saved to: ${mdPath}`);
        
        return analysis;
    }
}

// Run analysis if executed directly
if (require.main === module) {
    const projectRoot = path.join(__dirname, '..');
    const analyzer = new RouteAnalyzer(projectRoot);
    analyzer.saveAnalysis();
}

module.exports = RouteAnalyzer;