import { config } from 'dotenv';
config(); // Load environment variables

import { DataSource } from 'typeorm';
import { typeOrmConfig } from '../config/typeorm.config';
import { RealEstateDeveloper } from '../entities/real-estate-developer.entity';
import { RealEstateDeveloperEmployee, UserRole } from '../entities/real-estate-developer-employee.entity';
import { Office } from '../entities/office.entity';
import { Project, ProjectStatus, ProjectType, PropertyType } from '../entities/project.entity';
import { ProjectEmployee, ProjectRole } from '../entities/project-employee.entity';
import * as bcrypt from 'bcrypt';

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  // Initialize database connection
  const dataSource = new DataSource(typeOrmConfig as any);
  await dataSource.initialize();

  console.log('✅ Database connected');

  try {
    // 1. Create DLF Real Estate Developer
    const developerRepo = dataSource.getRepository(RealEstateDeveloper);
    
    let developer = await developerRepo.findOne({ where: { name: 'DLF' } });
    
    if (!developer) {
      developer = developerRepo.create({
        name: 'DLF',
        description: 'DLF is India\'s largest commercial real estate developer. Founded in 1946, DLF has been at the forefront of the Indian real estate industry for over 75 years.',
        address: 'DLF Centre, Parliament Street, New Delhi',
        phone: '+91-11-4166-6166',
        email: 'info@dlf.in',
        isActive: true,
      });
      
      developer = await developerRepo.save(developer);
      console.log('✅ Created DLF Developer');
    } else {
      console.log('ℹ️ DLF Developer already exists');
    }

    // 2. Create Office
    const officeRepo = dataSource.getRepository(Office);
    
    let office = await officeRepo.findOne({ where: { name: 'DLF Head Office' } });
    
    if (!office) {
      office = officeRepo.create({
        name: 'DLF Head Office',
        address: 'DLF Centre, Parliament Street',
        city: 'New Delhi',
        state: 'Delhi',
        region: 'North India',
        phone: '+91-11-4166-6166',
        realEstateDeveloperId: developer.id,
        isMainOffice: true,
        isActive: true,
      });
      
      office = await officeRepo.save(office);
      console.log('✅ Created DLF Office');
    } else {
      console.log('ℹ️ DLF Office already exists');
    }

    // 3. Create Employees with same credentials (username: admin, password: admin123)
    const employeeRepo = dataSource.getRepository(RealEstateDeveloperEmployee);
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const employeeData = [
      { username: 'admin', role: UserRole.ADMIN, name: 'Rajesh Kumar' },
      { username: 'manager1', role: UserRole.MANAGER, name: 'Priya Sharma' },
      { username: 'manager2', role: UserRole.MANAGER, name: 'Amit Singh' },
      { username: 'sales1', role: UserRole.SALES_MANAGER, name: 'Neha Gupta' },
      { username: 'sales2', role: UserRole.SALES_MANAGER, name: 'Vikram Patel' },
    ];

    const employees: RealEstateDeveloperEmployee[] = [];
    
    for (const empData of employeeData) {
      let employee = await employeeRepo.findOne({ where: { username: empData.username } });
      
      if (!employee) {
        employee = employeeRepo.create({
          username: empData.username,
          password: hashedPassword,
          name: empData.name,
          email: `${empData.username}@dlf.in`,
          role: empData.role,
          realEstateDeveloperId: developer.id,
          officeId: office.id,
          isActive: true,
        });
        
        employee = await employeeRepo.save(employee);
        console.log(`✅ Created employee: ${empData.name} (${empData.username})`);
      } else {
        console.log(`ℹ️ Employee ${empData.username} already exists`);
      }
      
      employees.push(employee);
    }

    // 4. Create 10 Projects
    const projectRepo = dataSource.getRepository(Project);
    
    const projectsData = [
      {
        name: 'DLF Cyber City Phase V',
        description: 'Premium commercial office spaces in Cyber City with state-of-the-art facilities and modern amenities.',
        address: 'Sector 24, Cyber City',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122002',
        latitude: 28.4944,
        longitude: 77.0787,
        projectType: ProjectType.COMMERCIAL,
        propertyType: PropertyType.OFFICE,
        minPrice: 15000000,
        maxPrice: 50000000,
        totalUnits: 150,
        availableUnits: 120,
        launchDate: '2024-01-15',
        possessionDate: '2026-12-31',
        reraNumber: 'HRERA-GGM-PROJ-001-2024',
        amenities: ['24/7 Security', 'Power Backup', 'Parking', 'Food Court', 'Conference Rooms']
      },
      {
        name: 'DLF The Magnolias',
        description: 'Luxury residential villas with private gardens and premium finishes in a gated community.',
        address: 'Golf Course Road',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122001',
        latitude: 28.4595,
        longitude: 77.0266,
        projectType: ProjectType.RESIDENTIAL,
        propertyType: PropertyType.VILLA,
        minPrice: 80000000,
        maxPrice: 200000000,
        totalUnits: 50,
        availableUnits: 35,
        launchDate: '2023-06-01',
        possessionDate: '2025-12-31',
        reraNumber: 'HRERA-GGM-PROJ-002-2023',
        amenities: ['Swimming Pool', 'Gym', 'Club House', 'Gardens', 'Security', 'Power Backup']
      },
      {
        name: 'DLF Capital Greens Phase III',
        description: 'Modern apartments with green spaces and contemporary amenities in the heart of Delhi.',
        address: 'Karampura',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110015',
        latitude: 28.6518,
        longitude: 77.1472,
        projectType: ProjectType.RESIDENTIAL,
        propertyType: PropertyType.APARTMENT,
        minPrice: 12000000,
        maxPrice: 35000000,
        totalUnits: 200,
        availableUnits: 180,
        launchDate: '2024-03-01',
        possessionDate: '2027-03-31',
        reraNumber: 'DLRERA2024R001',
        amenities: ['Swimming Pool', 'Gym', 'Kids Play Area', 'Parking', 'Security', 'Elevator']
      },
      {
        name: 'DLF Mall of India Extension',
        description: 'Premium retail and commercial spaces in India\'s largest mall with high footfall.',
        address: 'Sector 18',
        city: 'Noida',
        state: 'Uttar Pradesh',
        pincode: '201301',
        latitude: 28.5706,
        longitude: 77.3272,
        projectType: ProjectType.COMMERCIAL,
        propertyType: PropertyType.SHOP,
        minPrice: 8000000,
        maxPrice: 25000000,
        totalUnits: 100,
        availableUnits: 75,
        launchDate: '2024-02-01',
        possessionDate: '2025-12-31',
        reraNumber: 'UPRERA-NOI-PROJ-001-2024',
        amenities: ['Food Court', 'Parking', 'Security', 'Central AC', 'High Speed Internet']
      },
      {
        name: 'DLF Garden City Plots',
        description: 'Residential plots in a well-planned community with all modern infrastructure.',
        address: 'Sector 91-92',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122505',
        latitude: 28.4089,
        longitude: 76.9713,
        projectType: ProjectType.RESIDENTIAL,
        propertyType: PropertyType.PLOT,
        minPrice: 5000000,
        maxPrice: 15000000,
        totalUnits: 300,
        availableUnits: 250,
        launchDate: '2023-09-01',
        possessionDate: '2024-12-31',
        reraNumber: 'HRERA-GGM-PROJ-003-2023',
        amenities: ['Wide Roads', 'Street Lights', 'Water Supply', 'Sewerage', 'Parks', 'Security']
      },
      {
        name: 'DLF Corporate Park',
        description: 'Grade A commercial office spaces with modern architecture and premium amenities.',
        address: 'MG Road',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122002',
        latitude: 28.4744,
        longitude: 77.0845,
        projectType: ProjectType.COMMERCIAL,
        propertyType: PropertyType.OFFICE,
        minPrice: 20000000,
        maxPrice: 75000000,
        totalUnits: 80,
        availableUnits: 65,
        launchDate: '2024-04-01',
        possessionDate: '2026-06-30',
        reraNumber: 'HRERA-GGM-PROJ-004-2024',
        amenities: ['Conference Rooms', 'Cafeteria', 'Parking', 'High Speed Internet', 'Security', 'Power Backup']
      },
      {
        name: 'DLF Kings Court',
        description: 'Ultra-luxury apartments with panoramic views and world-class amenities.',
        address: 'Golf Course Road',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122001',
        latitude: 28.4682,
        longitude: 77.0297,
        projectType: ProjectType.RESIDENTIAL,
        propertyType: PropertyType.APARTMENT,
        minPrice: 45000000,
        maxPrice: 120000000,
        totalUnits: 120,
        availableUnits: 95,
        launchDate: '2023-11-01',
        possessionDate: '2026-11-30',
        reraNumber: 'HRERA-GGM-PROJ-005-2023',
        amenities: ['Infinity Pool', 'Spa', 'Gym', 'Concierge', 'Valet Parking', 'Club House', 'Security']
      },
      {
        name: 'DLF Warehouse Hub',
        description: 'Modern warehousing and logistics facilities with strategic location and connectivity.',
        address: 'Sector 89',
        city: 'Faridabad',
        state: 'Haryana',
        pincode: '121002',
        latitude: 28.4089,
        longitude: 77.3178,
        projectType: ProjectType.COMMERCIAL,
        propertyType: PropertyType.WAREHOUSE,
        minPrice: 25000000,
        maxPrice: 100000000,
        totalUnits: 40,
        availableUnits: 32,
        launchDate: '2024-01-01',
        possessionDate: '2025-06-30',
        reraNumber: 'HRERA-FBD-PROJ-001-2024',
        amenities: ['Loading Dock', 'Office Space', 'Security', 'Fire Safety', 'Power Backup', 'Parking']
      },
      {
        name: 'DLF Premium Floors',
        description: 'Independent floors with private entrances and modern amenities in a gated community.',
        address: 'Sector 42',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122003',
        latitude: 28.4486,
        longitude: 77.0703,
        projectType: ProjectType.RESIDENTIAL,
        propertyType: PropertyType.VILLA,
        minPrice: 30000000,
        maxPrice: 60000000,
        totalUnits: 80,
        availableUnits: 68,
        launchDate: '2024-05-01',
        possessionDate: '2026-05-31',
        reraNumber: 'HRERA-GGM-PROJ-006-2024',
        amenities: ['Private Garden', 'Car Parking', 'Security', 'Power Backup', 'Water Storage', 'Club House']
      },
      {
        name: 'DLF Mixed Use Complex',
        description: 'Integrated development with residential, commercial, and retail spaces.',
        address: 'Sector 54',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122004',
        latitude: 28.4420,
        longitude: 77.0982,
        projectType: ProjectType.MIXED_USE,
        propertyType: PropertyType.APARTMENT,
        minPrice: 18000000,
        maxPrice: 85000000,
        totalUnits: 250,
        availableUnits: 200,
        launchDate: '2023-12-01',
        possessionDate: '2027-12-31',
        reraNumber: 'HRERA-GGM-PROJ-007-2023',
        amenities: ['Shopping Mall', 'Restaurants', 'Office Spaces', 'Parking', 'Security', 'Gardens', 'Gym']
      },
    ];

    const projects: Project[] = [];
    
    for (let i = 0; i < projectsData.length; i++) {
      const projectData = projectsData[i];
      
      let project = await projectRepo.findOne({ where: { name: projectData.name } });
      
      if (!project) {
        const projectCreateData = {
          name: projectData.name,
          description: projectData.description,
          address: projectData.address,
          city: projectData.city,
          state: projectData.state,
          pincode: projectData.pincode,
          latitude: projectData.latitude || 0,
          longitude: projectData.longitude || 0,
          projectType: projectData.projectType,
          propertyType: projectData.propertyType,
          status: ProjectStatus.PUBLISHED,
          minPrice: projectData.minPrice,
          maxPrice: projectData.maxPrice,
          totalUnits: projectData.totalUnits,
          availableUnits: projectData.availableUnits,
          launchDate: projectData.launchDate,
          possessionDate: projectData.possessionDate,
          reraNumber: projectData.reraNumber,
          totalArea: 50000,
          areaUnit: 'sq ft',
          expectedCompletionDate: projectData.possessionDate,
          constructionStartDate: projectData.launchDate,
          amenities: projectData.amenities,
          realEstateDeveloperId: developer.id,
          projectManagerId: employees[1].id, // Manager1
          salesManagerId: employees[3].id, // Sales1
          isActive: true,
          floorPlans: [
            {
              type: '2BHK',
              area: 1200,
              areaUnit: 'sq ft',
              bedrooms: 2,
              bathrooms: 2,
              price: projectData.minPrice,
            },
            {
              type: '3BHK',
              area: 1800,
              areaUnit: 'sq ft',
              bedrooms: 3,
              bathrooms: 3,
              price: Math.round((projectData.minPrice + projectData.maxPrice) / 2),
            },
            {
              type: '4BHK',
              area: 2500,
              areaUnit: 'sq ft',
              bedrooms: 4,
              bathrooms: 4,
              price: projectData.maxPrice,
            },
          ],
          images: [
            {
              url: `https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800`,
              type: 'exterior',
              caption: 'Building Exterior View',
            },
            {
              url: `https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800`,
              type: 'interior',
              caption: 'Sample Interior',
            },
            {
              url: `https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800`,
              type: 'amenity',
              caption: 'Amenities View',
            },
          ],
          brochures: [
            {
              url: `https://example.com/brochure-${i + 1}.pdf`,
              name: `${projectData.name} - Project Brochure`,
            },
          ],
          nearbyFacilities: {
            schools: ['Delhi Public School - 2km', 'Ryan International - 3km'],
            hospitals: ['Fortis Hospital - 1.5km', 'Max Hospital - 2.5km'],
            malls: ['Ambience Mall - 1km', 'DLF Mall - 2km'],
            metro: ['HUDA City Centre - 1km', 'IFFCO Chowk - 2km']
          },
          legalDetails: 'All legal approvals obtained. Clear title. Ready for registration.',
        };
        
        project = projectRepo.create(projectCreateData);
        project = await projectRepo.save(project);
        console.log(`✅ Created project: ${projectData.name}`);
        
        // Assign employees to projects
        const projectEmployeeRepo = dataSource.getRepository(ProjectEmployee);
        
        // Assign manager and sales employees
        const today = new Date();
        const projectEmployees = [
          {
            projectId: project.id,
            employeeId: employees[1].id, // Manager1
            role: ProjectRole.PROJECT_MANAGER,
            assignedDate: today,
          },
          {
            projectId: project.id,
            employeeId: employees[3].id, // Sales1
            role: ProjectRole.SALES_MANAGER,
            assignedDate: today,
          },
          {
            projectId: project.id,
            employeeId: employees[4].id, // Sales2
            role: ProjectRole.SALES_EXECUTIVE,
            assignedDate: today,
          },
        ];
        
        for (const empData of projectEmployees) {
          const existing = await projectEmployeeRepo.findOne({
            where: {
              projectId: empData.projectId,
              employeeId: empData.employeeId,
            },
          });
          
          if (!existing) {
            const projectEmployee = projectEmployeeRepo.create(empData);
            await projectEmployeeRepo.save(projectEmployee);
          }
        }
        
        projects.push(project);
      } else {
        console.log(`ℹ️ Project ${projectData.name} already exists`);
        projects.push(project);
      }
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Created/Updated:');
    console.log(`   • 1 Real Estate Developer (DLF)`);
    console.log(`   • 1 Office (DLF Head Office)`);
    console.log(`   • 5 Employees`);
    console.log(`   • ${projects.length} Projects`);
    console.log('\n🔐 Login Credentials:');
    console.log('   • Admin: username=admin, password=admin123');
    console.log('   • Manager1: username=manager1, password=admin123');
    console.log('   • Manager2: username=manager2, password=admin123');
    console.log('   • Sales1: username=sales1, password=admin123');
    console.log('   • Sales2: username=sales2, password=admin123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await dataSource.destroy();
    console.log('✅ Database connection closed');
  }
}

// Run the seeding script
seedDatabase().catch(console.error);