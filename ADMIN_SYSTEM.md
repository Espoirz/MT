# Admin System Documentation

## Overview

The MT Breeding Game now includes a comprehensive admin system that allows administrators to manage users, animals, and monitor system statistics.

## Admin Login Credentials

**Default Admin Account:**
- **Email:** admin@mtgame.com
- **Username:** admin
- **Password:** admin123

⚠️ **IMPORTANT:** Please change the password after first login!

## Admin Features

### 1. Role-Based Access Control

The system now supports user roles:
- **user** (default): Regular users with standard game access
- **admin**: Full administrative access

### 2. Admin Dashboard

Access the admin dashboard at `/admin` (only visible to admin users).

**Dashboard Statistics:**
- Total users count
- Premium vs Basic membership breakdown
- Admin users count
- Total animals (dogs and horses)
- Dogs in shelter
- Wild vs owned animals

### 3. User Management

**Features:**
- View all users with pagination
- Search users by username or email
- Update user roles and membership tiers
- Modify user coins and gems
- Delete users (with protection against deleting other admins)

**Available Actions:**
- Toggle Premium membership
- Grant/revoke admin privileges
- Adjust user resources
- User account deletion

### 4. Animal Management

**Features:**
- View all dogs and horses
- Search animals by name or breed
- Filter by animal type
- Move dogs to shelter system
- View ownership information

**Available Actions:**
- Move owned dogs to shelter
- Monitor animal statistics
- Track breeding activities

### 5. Security Features

**Admin Middleware:**
- JWT token validation
- Role-based authorization
- Protected admin routes
- Session management

**Access Control:**
- Admin routes require both valid authentication AND admin role
- Prevents regular users from accessing admin functions
- Protects against admin privilege escalation

## Technical Implementation

### Backend Components

**Models:**
- `User` model enhanced with `role` field
- Supports 'user' and 'admin' roles
- Default role is 'user'

**Middleware:**
- `adminAuth.js`: Validates admin access
- Checks JWT token AND admin role
- Returns 403 for non-admin users

**Controllers:**
- `adminController.js`: All admin functionality
- Dashboard statistics
- User management operations
- Animal management operations

**Routes:**
- `/api/admin/*`: All admin endpoints
- Protected by adminAuth middleware
- RESTful API design

### Frontend Components

**AdminDashboard Component:**
- Tabbed interface (Dashboard, Users, Animals)
- Real-time statistics display
- User management interface
- Animal management interface
- Search and filter capabilities

**Navigation:**
- Admin link appears in navbar for admin users only
- Shield icon (🛡️) for admin access
- Conditional rendering based on user role

## API Endpoints

### Admin Authentication
- All admin endpoints require `Authorization: Bearer <token>` header
- Token must belong to user with `role: 'admin'`

### Dashboard
- `GET /api/admin/dashboard` - Get system statistics

### User Management
- `GET /api/admin/users` - Get all users (with pagination/search)
- `PUT /api/admin/users/:id` - Update user (role, membership, coins, gems)
- `DELETE /api/admin/users/:id` - Delete user
- `POST /api/admin/create-admin` - Create new admin user

### Animal Management
- `GET /api/admin/animals` - Get all animals (with pagination/search)
- `POST /api/admin/dogs/:id/shelter` - Move dog to shelter

## Usage Examples

### Creating Additional Admin Users

```bash
# Using the API endpoint
curl -X POST http://localhost:5000/api/admin/create-admin \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin2",
    "email": "admin2@mtgame.com",
    "password": "newpassword123"
  }'
```

### Updating User Membership

```bash
# Toggle user to premium
curl -X PUT http://localhost:5000/api/admin/users/USER_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "membershipTier": "premium"
  }'
```

### Getting System Statistics

```bash
# Get dashboard stats
curl -X GET http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## Security Best Practices

1. **Change Default Password:** Always change the default admin password
2. **Secure JWT Secret:** Use a strong JWT secret in production
3. **HTTPS Only:** Use HTTPS in production environments
4. **Rate Limiting:** Consider implementing rate limiting for admin endpoints
5. **Audit Logging:** Consider adding audit logs for admin actions
6. **Backup Database:** Regular backups of user and animal data

## Future Enhancements

### Planned Features
- Admin action audit logs
- Advanced user analytics
- Bulk user operations
- Animal breeding oversight
- Economic system monitoring
- Report generation
- Email notifications for admin actions

### Monitoring & Analytics
- User growth tracking
- Feature usage statistics
- Revenue analytics (premium memberships)
- System performance monitoring
- Security incident tracking

## Troubleshooting

### Common Issues

**Cannot Access Admin Panel:**
- Verify user has `role: 'admin'` in database
- Check JWT token validity
- Confirm admin routes are properly configured

**Database Connection Issues:**
- Ensure MongoDB is running
- Check database connection string
- Verify environment variables

**Authentication Failures:**
- Check JWT secret configuration
- Verify token format and expiration
- Ensure admin middleware is properly applied

### Database Queries

```javascript
// Check user role in MongoDB
db.users.find({ role: 'admin' })

// Update user to admin
db.users.updateOne(
  { email: 'user@example.com' },
  { $set: { role: 'admin' } }
)

// Get system statistics
db.users.aggregate([
  { $group: { _id: '$role', count: { $sum: 1 } } }
])
```

## Conclusion

The admin system provides comprehensive management capabilities for the MT Breeding Game. It enables efficient user management, system monitoring, and administrative control while maintaining security and ease of use.

For technical support or feature requests, please contact the development team.
