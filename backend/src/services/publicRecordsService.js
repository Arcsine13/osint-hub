const axios = require('axios');

class PublicRecordsService {
  constructor() {
    this.peopleDataLabsKey = process.env.PEOPLEDATALABS_KEY;
  }

  async searchByEmail(email, searchId, io) {
    const results = {
      email,
      accounts: [],
      publicRecords: [],
      associatedData: {}
    };

    try {
      // Try PeopleDataLabs
      if (this.peopleDataLabsKey) {
        const personData = await this.searchPeopleDataLabs(email);
        if (personData) {
          results.publicRecords.push(personData);
          results.associatedData = personData;
        }
      }

      // Email pattern analysis
      results.accounts = await this.analyzeEmailPatterns(email);

    } catch (error) {
      console.error('Email lookup error:', error);
    }

    if (io) {
      io.to(`search-${searchId}`).emit('email-lookup-complete', {
        searchId,
        results
      });
    }

    return results;
  }

  async searchByPhone(phone, searchId, io) {
    const results = {
      phone,
      possibleNames: [],
      possibleLocations: [],
      carriers: [],
      publicRecords: []
    };

    try {
      // Basic phone number analysis
      results.carriers = this.analyzePhoneNumber(phone);
      
      // Try PeopleDataLabs if available
      if (this.peopleDataLabsKey) {
        const personData = await this.searchPeopleDataLabsByPhone(phone);
        if (personData) {
          results.publicRecords.push(personData);
        }
      }

    } catch (error) {
      console.error('Phone lookup error:', error);
    }

    if (io) {
      io.to(`search-${searchId}`).emit('phone-lookup-complete', {
        searchId,
        results
      });
    }

    return results;
  }

  async searchPeopleDataLabs(email) {
    try {
      const response = await axios.post(
        'https://api.peopledatalabs.com/v5/person/enrich',
        { email },
        {
          params: { api_key: this.peopleDataLabsKey },
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response.data && response.data.id) {
        const person = response.data;
        return {
          type: 'person',
          fullName: [person.first_name, person.last_name].filter(Boolean).join(' '),
          locations: person.addresses || [],
          socialProfiles: person.social_profiles || [],
          education: person.education || [],
          experience: person.experience || [],
          confidence: person.confidence_score || 0
        };
      }
    } catch (error) {
      console.error('PeopleDataLabs error:', error.message);
    }
    return null;
  }

  async searchPeopleDataLabsByPhone(phone) {
    try {
      const response = await axios.post(
        'https://api.peopledatalabs.com/v5/person/enrich',
        { phone },
        {
          params: { api_key: this.peopleDataLabsKey },
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response.data && response.data.id) {
        const person = response.data;
        return {
          type: 'person',
          fullName: [person.first_name, person.last_name].filter(Boolean).join(' '),
          locations: person.addresses || [],
          socialProfiles: person.social_profiles || [],
          confidence: person.confidence_score || 0
        };
      }
    } catch (error) {
      console.error('PeopleDataLabs phone error:', error.message);
    }
    return null;
  }

  async analyzeEmailPatterns(email) {
    const [username, domain] = email.split('@');
    const platforms = [];

    // Check common platforms with this email pattern
    const commonPlatforms = [
      { name: 'GitHub', urlPattern: 'https://github.com/' },
      { name: 'Twitter', urlPattern: 'https://twitter.com/' },
      { name: 'LinkedIn', urlPattern: 'https://linkedin.com/in/' },
      { name: 'Instagram', urlPattern: 'https://instagram.com/' }
    ];

    // Note: This is pattern-based, not actual verification
    // Real implementation would need actual API calls
    for (const platform of commonPlatforms) {
      platforms.push({
        platform: platform.name,
        username: username,
        url: `${platform.urlPattern}${username}`,
        status: 'possible',
        note: 'Pattern match - verify manually'
      });
    }

    return platforms;
  }

  analyzePhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const carriers = [];

    // Basic US phone number analysis
    if (cleaned.length === 10 || (cleaned.length === 11 && cleaned[0] === '1')) {
      const areaCode = cleaned.length === 11 ? cleaned.substring(1, 4) : cleaned.substring(0, 3);
      
      // Area code to region mapping (simplified)
      const regions = {
        '212': 'New York, NY',
        '213': 'Los Angeles, CA',
        '312': 'Chicago, IL',
        '415': 'San Francisco, CA',
        '713': 'Houston, TX',
        '202': 'Washington, DC',
        '305': 'Miami, FL',
        '404': 'Atlanta, GA',
        '617': 'Boston, MA',
        '206': 'Seattle, WA'
      };

      if (regions[areaCode]) {
        carriers.push({
          type: 'region',
          value: regions[areaCode],
          confidence: 80
        });
      }
    }

    return carriers;
  }
}

module.exports = new PublicRecordsService();
