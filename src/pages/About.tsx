
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Users, MapPin, Phone, Mail, Clock, Award } from "lucide-react";

const About = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-gov-blue-800 mb-2">
          About Gram Panchayat Kon
        </h1>
        <p className="text-gray-600">
          Learn about our village administration, history, and governance
        </p>
      </div>

      <Tabs defaultValue="overview" className="mb-12">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="administration">Administration</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-heading font-semibold text-gov-blue-700 mb-4">
                    Gram Panchayat Kon
                  </h2>
                  <p className="text-gray-700 mb-4">
                    Kon is a vibrant village located in the Thane district of Maharashtra, India. 
                    The Gram Panchayat is the local self-government organization at the village level, 
                    responsible for administration and development of the village.
                  </p>
                  <p className="text-gray-700 mb-4">
                    Our mission is to provide transparent, efficient, and responsive governance 
                    to the citizens of Kon village. We strive for inclusive development and 
                    aim to enhance the quality of life for all our residents.
                  </p>
                  <p className="text-gray-700">
                    The Gram Panchayat consists of elected representatives from the village, 
                    headed by the Sarpanch (Village Head). We work closely with various district 
                    and state government departments to implement development projects and welfare schemes.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-heading font-semibold text-gov-blue-700 mb-4">
                    Quick Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="text-gov-blue-600 mt-1 mr-3 h-5 w-5 shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Location</p>
                        <p className="text-gray-600">Thane District, Maharashtra</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Users className="text-gov-blue-600 mt-1 mr-3 h-5 w-5 shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Population</p>
                        <p className="text-gray-600">Approximately 5,000 residents</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Award className="text-gov-blue-600 mt-1 mr-3 h-5 w-5 shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Established</p>
                        <p className="text-gray-600">1952</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="text-gov-blue-600 mt-1 mr-3 h-5 w-5 shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Office Hours</p>
                        <p className="text-gray-600">10:00 AM to 5:00 PM (Mon-Sat)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-heading font-semibold text-gov-blue-700 mb-4">
                History of Kon Village
              </h2>
              <p className="text-gray-700 mb-4">
                Kon village has a rich historical legacy dating back several centuries. The village 
                has witnessed significant cultural and social evolution over the years, while preserving 
                its traditional values and heritage.
              </p>
              <p className="text-gray-700 mb-4">
                Originally an agrarian community, Kon has transformed over the decades but agriculture 
                still remains the primary occupation for many villagers. The village played an important role 
                during India's freedom struggle, with many residents actively participating in the movement.
              </p>
              <p className="text-gray-700 mb-4">
                The Gram Panchayat system was established in Kon shortly after India's independence, 
                as part of the nationwide initiative to strengthen local self-governance. Since then, 
                the Panchayat has been instrumental in the village's development and administration.
              </p>
              <p className="text-gray-700">
                Over the years, Kon has seen significant improvements in infrastructure, education, 
                healthcare, and other essential services. The village continues to grow while maintaining 
                its unique cultural identity and community spirit.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="administration" className="mt-0">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-heading font-semibold text-gov-blue-700 mb-4">
                Administration Structure
              </h2>
              <p className="text-gray-700 mb-4">
                The administration of Kon village is organized through the Gram Panchayat, which is the 
                constitutional body for local self-governance. The current administrative structure includes:
              </p>
              
              <div className="space-y-6 mt-6">
                <div>
                  <h3 className="text-lg font-medium text-gov-blue-700 mb-2">Elected Representatives</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li><strong>Gram Sarpanch (Village Head):</strong> Leads the Panchayat and presides over meetings</li>
                    <li><strong>Up-Sarpanch (Deputy):</strong> Assists the Sarpanch and acts in their absence</li>
                    <li><strong>Ward Members:</strong> Elected representatives from different areas of the village</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gov-blue-700 mb-2">Administrative Staff</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li><strong>Gram Sevak:</strong> Government-appointed official who acts as Secretary</li>
                    <li><strong>Village Development Officer:</strong> Responsible for development projects</li>
                    <li><strong>Panchayat Clerk:</strong> Handles administrative paperwork and records</li>
                    <li><strong>Technical Staff:</strong> Supports infrastructure and technical projects</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gov-blue-700 mb-2">Functional Committees</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li><strong>Development Committee:</strong> Plans and monitors development projects</li>
                    <li><strong>Education Committee:</strong> Oversees educational institutions and programs</li>
                    <li><strong>Health & Sanitation Committee:</strong> Monitors public health initiatives</li>
                    <li><strong>Women & Child Welfare Committee:</strong> Focuses on welfare schemes</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="mt-0">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-heading font-semibold text-gov-blue-700 mb-4">
                Contact Information
              </h2>
              <p className="text-gray-700 mb-6">
                For any inquiries, feedback, or assistance, please feel free to contact us 
                through any of the following channels:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Building className="text-gov-blue-600 mt-1 mr-3 h-5 w-5 shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Office Address</p>
                      <p className="text-gray-600">
                        Gram Panchayat Office<br />
                        Main Road, Kon Village<br />
                        Thane District, Maharashtra - 421204
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="text-gov-blue-600 mt-1 mr-3 h-5 w-5 shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <p className="text-gray-600">+91 2245 678901</p>
                      <p className="text-gray-600">+91 9876543210 (Helpline)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="text-gov-blue-600 mt-1 mr-3 h-5 w-5 shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">grampanchayat.kon@gov.in</p>
                      <p className="text-gray-600">sarpanch.kon@gov.in</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="text-gov-blue-600 mt-1 mr-3 h-5 w-5 shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Office Hours</p>
                      <p className="text-gray-600">Monday to Saturday</p>
                      <p className="text-gray-600">10:00 AM to 5:00 PM</p>
                      <p className="text-gray-600">Closed on Sundays and Public Holidays</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-100 rounded-lg p-4 h-64 flex items-center justify-center">
                  <p className="text-gray-500 text-center">Map location will be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default About;
