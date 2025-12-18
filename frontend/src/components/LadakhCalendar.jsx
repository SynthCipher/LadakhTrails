import React, { useState, useMemo } from 'react';
import { Calendar, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

const LadakhCalendar = () => {
    const festivals = [
        {
            date: "14 Dec",
            name: "Galdan Namchot",
            location: "Across Ladakh",
            description: "Galdan Namchot, the 'festival of lights' in Ladakh, is observed on the 25th of the tenth Tibetan month to honor Je Tsongkhapa, founder of the Gelug order. Monasteries and homes glow with butter lamps and candles, symbolizing the dispelling of darkness and heralding the New Year celebrations."
        },
        {
            date: "20 Dec",
            name: "Losar",
            // Corrected description from the input
            location: "Across Ladakh",
            description: "Losar, the Ladakhi New Year, is a deeply significant 15-day celebration. The Buddhist community observes this time with special fervour, filled with prayers to the Three Jewels-Buddha. It is also a time for gathering among friends and family to celebrate the start of the Tibetan calendar."
        },
        {
            date: "Jan (Various)",
            name: "Chadar Trek Season",
            location: "Zanskar River",
            description: "The Chadar Trek or Zanskar Gorge is traditionally the only means of travel in the area during winter. It has gained popularity as a premier adventure tourism destination."
        },
        {
            date: "16-17 Jan",
            name: "Spituk Gustor",
            location: "Spituk Monastery",
            description: "A vibrant two-day event held annually at Spituk Monastery, 8km from Leh. Monks in ornate robes perform elaborate dances (Serskam and Hashang Hatuk) representing deities. It signals the anticipation of warmer weather and prosperity."
        },
        {
            date: "20 Jan",
            name: "Mamani Festival",
            location: "Kargil",
            description: "Mamani is an ethnic food festival observed in January, signaling the end of winter. Families prepare traditional cuisines and serve them to villagers, with offerings also made to ancestors."
        },
        {
            date: "22-28 Jan",
            name: "Winter Carnival",
            location: "Zanskar",
            description: "Organized by the Tourism Department to promote winter tourism. Features multi-cultural programs, ethnic food festivals, and sports events like snow skiing and ice hockey."
        },
        {
            date: "25 Jan",
            name: "National Tourism Day",
            location: "Leh, Kargil",
            description: "Celebrating the importance of tourism in Ladakh with various cultural events and awareness programs."
        },
        {
            date: "1-2 Feb",
            name: "Ice Climbing Festival",
            location: "Leh",
            description: "Showcases the region's potential as a premier destination for ice climbing and winter adventure sports, promoting sustainable tourism."
        },
        {
            date: "11-13 Feb",
            name: "Snow Leopard Festival",
            location: "Hemis National Park, Rumbak",
            description: "With the highest number of snow leopards in India, this festival raises awareness about this endangered species and promotes eco-tourism and wildlife conservation."
        },
        {
            date: "15-16 Feb",
            name: "Dosmochey",
            location: "Leh, Likir, Diskit",
            description: "A grand festival uniting monasteries with sacred mask dances. Monks craft 'dho' effigies to capture evil spirits and burn them to dispel negativity, ushering in the Tibetan New Year."
        },
        {
            date: "21-28 Feb",
            name: "Winter Carnival",
            location: "Drass",
            description: "A week-long celebration in the second coldest inhabited place, featuring cultural programs, food festivals, and winter sports to boost tourism in Drass."
        },
        {
            date: "25-26 Feb",
            name: "Stok Guru Tsechu",
            location: "Stok Monastery",
            description: "Held on the 9th and 10th of the first Tibetan month. Oracles enter trances to perform ancient rituals and offer prophetic advice to attendees seeking blessings."
        },
        {
            date: "2-3 Mar",
            name: "Matho Nagrang",
            location: "Matho Monastery",
            description: "Famed festival of the only Sakya monastery in Ladakh. Attracts crowds for its two resident oracles, known as Rongtsans, who perform spiritual acts during the festival."
        },
        {
            date: "3-6 Mar",
            name: "Local Archery Festival",
            location: "Zanskar",
            description: "Aims to revive archery traditions in Zanskar, encouraging the use of traditional bamboo bows and arrow shafts."
        },
        {
            date: "18 Mar",
            name: "Shey Doo Lhoo",
            location: "Shey Monastery",
            description: "Marks the beginning of the sowing season. Monks perform rituals at the Eshey Gonbo shrine, bringing villagers together to celebrate the upcoming planting season."
        },
        {
            date: "23 Mar",
            name: "Brown Bear Day",
            location: "Kargil",
            description: "Observed to raise awareness about the Himalayan brown bear in Ladakh, promoting coexistence and habitat preservation."
        }
    ];

    const [expandedId, setExpandedId] = useState(null);

    const toggleExpand = (idx) => {
        setExpandedId(expandedId === idx ? null : idx);
    };

    // Correctly sort parsing dates
    const sortedFestivals = useMemo(() => {
        const today = new Date();
        // Assuming current season context: Dec 2025 -> Mar 2026
        const currentYear = 2025;
        const nextYear = 2026;

        const parseFestivalDate = (dateStr) => {
            // Handle "Jan (Various)" or range "16-17 Jan"
            const parts = dateStr.split(' ');
            let day = parseInt(parts[0]);
            let monthStr = parts[1];

            // Handle "16-17 Jan" -> takes 17 as day (end date matter more for 'past' status) or 16?
            // Actually, if today is 18th, and event is 16-17, it's PAST.
            // If event is 20-25, it's FUTURE.
            // So we should look at the END date of the range to decide if it's fully past.

            // Regex to find month name
            const monthMatch = dateStr.match(/[a-zA-Z]{3}/);
            if (monthMatch) monthStr = monthMatch[0]; // "Dec", "Jan"

            // Regex to find last number for day (e.g. 16-17 -> 17)
            const nums = dateStr.match(/\d+/g);
            if (nums && nums.length > 0) {
                day = parseInt(nums[nums.length - 1]);
            } else {
                day = 28; // Default for "Jan (Various)" to end of month
            }

            /* 
               Simple Map:
               Dec -> 11 (0-indexed) -> Year 2025
               Jan -> 0 -> Year 2026
               Feb -> 1 -> Year 2026
               Mar -> 2 -> Year 2026
            */
            const monthMap = {
                'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
                'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
            };

            let month = monthMap[monthStr];
            let year = currentYear;

            if (month < 10) { // Jan, Feb, Mar
                year = nextYear;
            }

            const d = new Date(year, month, day);
            // Set end of day
            d.setHours(23, 59, 59, 999);
            return d;
        };

        const upcoming = [];
        const past = [];

        festivals.forEach(f => {
            const fDate = parseFestivalDate(f.date);
            if (fDate < today) {
                past.push(f);
            } else {
                upcoming.push(f);
            }
        });

        // Return combined list, upcoming first
        return [...upcoming, ...past];
    }, [festivals]);

    // Check if the festival is in the past (simple check for styling)
    const isPast = (fest) => {
        // Re-use logic or check index? 
        // Since we sorted, we can check by parsing again or just allow visual styling in the map
        // Actually, let's just use the same parsed date logic or a flagging property
        // Allow me to add a 'status' property in the map
        const today = new Date();
        const currentYear = 2025;
        const nextYear = 2026;
        // ... (same parsing) ...
        // Simpler: Just rely on the sorted order. But user might want visual distinction.
        // I'll add opacity to past items.
        return false; // placeholder, moved comparison inside render
    };

    // Quick helper for render to avoid duplicating heavy parsing
    const getIsPast = (dateStr) => {
        const today = new Date();
        const monthMap = { 'Jan': 0, 'Feb': 1, 'Mar': 2, 'Dec': 11 }; // Simple subset
        const monthMatch = dateStr.match(/[a-zA-Z]{3}/);
        if (!monthMatch) return false;
        const month = monthMap[monthMatch[0]];
        const year = month < 10 ? 2026 : 2025;

        const nums = dateStr.match(/\d+/g);
        const day = nums ? parseInt(nums[nums.length - 1]) : 28;

        const d = new Date(year, month, day, 23, 59, 59);
        return d < today;
    }


    return (
        <section className="py-16 px-4 bg-gradient-to-b from-blue-50 to-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4 font-sans">
                        🎉 Ladakh Cultural Calendar
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Experience the vibrant culture and spirit of Ladakh through our upcoming festivals and special events.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedFestivals.map((fest, idx) => {
                        const pastEvent = getIsPast(fest.date);
                        return (
                            <div
                                key={idx}
                                className={`bg-white rounded-xl shadow-lg overflow-hidden border-t-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${pastEvent ? 'opacity-60 grayscale border-gray-400' :
                                        (idx % 3 === 0 ? 'border-blue-500' : idx % 3 === 1 ? 'border-red-500' : 'border-yellow-500')
                                    }`}
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`rounded-lg px-3 py-1 flex items-center gap-2 text-sm font-semibold ${pastEvent ? 'bg-gray-200 text-gray-600' : 'bg-gray-100 text-gray-700'}`}>
                                            <Calendar size={16} className={pastEvent ? 'text-gray-500' : 'text-blue-600'} />
                                            {fest.date}
                                            {pastEvent && <span className="text-xs bg-gray-500 text-white px-1.5 rounded ml-1">PAST</span>}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded">
                                            <MapPin size={12} />
                                            {fest.location}
                                        </div>
                                    </div>

                                    <h3 className={`text-xl font-bold mb-3 leading-tight ${pastEvent ? 'text-gray-600' : 'text-gray-800'}`}>{fest.name}</h3>

                                    <div className={`relative ${expandedId === idx ? '' : 'max-h-24 overflow-hidden'}`}>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {fest.description}
                                        </p>
                                        {expandedId !== idx && (
                                            <div className={`absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t ${pastEvent ? 'from-gray-100' : 'from-white'} to-transparent`}></div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => toggleExpand(idx)}
                                        className={`mt-3 text-sm font-semibold flex items-center gap-1 transition ${pastEvent ? 'text-gray-500 hover:text-gray-700' : 'text-blue-600 hover:text-blue-800'}`}
                                    >
                                        {expandedId === idx ? (
                                            <>Read Less <ChevronUp size={16} /></>
                                        ) : (
                                            <>Read More <ChevronDown size={16} /></>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    );
};

export default LadakhCalendar;
