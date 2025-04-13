  const sampleListings = [
      {
        title: "Cozy Beachfront Cottage",
        discription:
          "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach.",
        price: 1500,
        image: {
          filename:"listingimage",
          url:"https://st.hzcdn.com/simgs/pictures/exteriors/hickory-hill-cozy-lake-cottage-visbeen-architects-img~3551555e0d5ed812_9-0540-1-14a9e9c.jpg"},
        country: "United States",
        location: "Malibu",
      },
      {
        title: "Modern Loft in Downtown",
        discription:
          "Stay in the heart of the city in this stylish loft apartment. Perfect for urban explorers!",
        price: 1200,
        image: {
          filename:"listingimage",
          url:"https://th.bing.com/th/id/OIP.Zt8U6Czy-nAj9QCEwIemwAHaE8?rs=1&pid=ImgDetMain"},
        country: "United States",
        location: "New York City",
      },
      {
        title: "Mountain Retreat",
        discription:
          "Unplug and unwind in this peaceful mountain cabin. Surrounded by nature, it's a perfect place to recharge.",
        price: 1000,
        image: {
          filename:"listingimage",
          url:"https://th.bing.com/th/id/OIP.XtjHBaP26UUGm2dlm4kKqAHaE7?rs=1&pid=ImgDetMain"},
        country: "United States",
        location: "Aspen",
      },
      {
        title: "Historic Villa in Tuscany",
        discription:
          "Experience the charm of Tuscany in this beautifully restored villa. Explore the rolling hills and vineyards.",
        price: 2500,
        image: {
          filename:"listingimage",
          url:"https://th.bing.com/th/id/OIP.Frn_HmrKSb4tOMwuL18_fQHaE8?rs=1&pid=ImgDetMain"},
        country: "Italy",
        location: "Florence",
      },
      {
        title: "Secluded Treehouse Getaway",
        discription:
          "Live among the treetops in this unique treehouse retreat. A true nature lover's paradise.",
        price: 800,
        image: {
          filename:"listingimage",
          url:"https://th.bing.com/th/id/OIP.BZiHI93yGtorGFFm4M56XQHaFS?rs=1&pid=ImgDetMain"},
        country: "United States",
        location: "Portland",
      },
      {
        title: "Beachfront Paradise",
        discription:
          "Step out of your door onto the sandy beach. This beachfront condo offers the ultimate relaxation.",
        price: 2000,
        image: {
          filename:"listingimage",
          url:"https://www.vacationforthesoul.com/wp-content/uploads/2022/11/mx-beachfront.jpg"},
        country: "Mexico",
        location: "Cancun",
      }, {
          title: "Luxury Condo in Singapore",
          discription:
            "Experience urban luxury in this modern condo with breathtaking views of Marina Bay Sands.",
          price: 3000,
          image: "https://th.bing.com/th/id/OIP.wCaaIRG-hxtFYaXtkencZQHaEH?rs=1&pid=ImgDetMain",
          country: "Singapore",
          location: "Marina Bay",
        },
        {
          title: "Cottage in the English Countryside",
          discription:
            "Relax in this charming cottage with a garden, surrounded by rolling hills and peaceful scenery.",
          price: 1200,
          image: "https://i.pinimg.com/originals/c0/dd/29/c0dd29fd1c748f251e113e7b2fc3c897.jpg",
          country: "United Kingdom",
          location: "Cornwall",
        },
        {
          title: "Overwater Bungalow in Bora Bora",
          discription:
            "Stay in an overwater bungalow with glass floors to view the turquoise waters below.",
          price: 8000,
          image: "https://1.bp.blogspot.com/-Ba9xnuzMWuk/XpSD5fAfOOI/AAAAAAAAybA/-IbkbGjO70Qu3CrfJ5oMt086AlGdQ5dowCPcBGAYYCw/s1600/IMG_9360.JPG",
          country: "French Polynesia",
          location: "Bora Bora",
        },
        {
          title: "Ski Cabin in Whistler",
          discription:
            "Hit the slopes from this cozy ski-in/ski-out cabin in Whistler's premier resort area.",
          price: 2500,
          image: {
            filename:"listingimage",
            url:"https://th.bing.com/th/id/OIP.M3A_sDwAq-_Xk61H3zQKkgHaE8?rs=1&pid=ImgDetMain"},
          country: "Canada",
          location: "Whistler",
        },
        {
          title: "Villa with Private Pool in Mykonos",
          discription:
            "Unwind in this luxurious villa with a private infinity pool overlooking the Aegean Sea.",
          price: 4000,
          image: {
            filename:"listingimage",
            url:"https://www.theacevip.com/wp-content/uploads/2023/05/luxury-mykonos-villa-at-night-.jpg"},
          country: "Greece",
          location: "Mykonos",
        },
        {
          title: "Desert Retreat in Joshua Tree",
          discription:
            "Reconnect with nature in this secluded desert retreat near Joshua Tree National Park.",
          price: 1800,
          image: {
            filename:"listingimage",
            url:"https://th.bing.com/th/id/OIP.PZeeCHmoBhQg9FsSd-WUiwHaE_?rs=1&pid=ImgDetMain"},
          country: "United States",
          location: "Joshua Tree",
        },
        {
          title: "Tropical Beach House in Zanzibar",
          discription:
            "Soak up the sun in this beachfront house with direct access to pristine white sands.",
          price: 2200,
          image: {
            filename:"listingimage",
            url:"https://media-cdn.tripadvisor.com/media/vr-splice-j/07/a8/4c/58.jpg"},
          country: "Tanzania",
          location: "Zanzibar",
        },
        {
          title: "City Apartment in Sydney",
          discription:
            "Explore the vibrant culture of Sydney from this centrally located modern apartment.",
          price: 2000,
          image: {
            filename:"listingimage",
            url:"https://thumbs.dreamstime.com/z/multi-shaped-round-high-rise-apartment-condominium-buildings-bondi-junction-sydney-australia-modern-136651497.jpg"},
          country: "Australia",
          location: "Sydney",
        }, {
          title: "Private Villa in Bali",
          discription:
            "Relax in a luxurious private villa with stunning jungle views and an infinity pool.",
          price: 3500,
          image: {
            filename:"listingimage",
            url:"https://th.bing.com/th/id/OIP._Hp9DtiXTesbzNOf9W4dSgHaEo?rs=1&pid=ImgDetMain"},
          country: "Indonesia",
          location: "Ubud",
        },
        {
          title: "Luxury Apartment in Paris",
          discription:
            "Experience the magic of Paris in this stylish apartment near the Eiffel Tower.",
          price: 4000,
          image: {
            filename:"listingimage",
            url:"https://th.bing.com/th/id/R.fedfe77c4d83c2c162e7cc00dfe987dc?rik=6nAclTIo3ZjinQ&riu=http%3a%2f%2fwww.casolvillasfrance.com%2fvilla-rentals%2fparis%2f16th-arrondissement%2fapartment%2fparis-16th-arrondissement-luxury-apartment-for-rent-4.jpg&ehk=ZgAvUdO4VpLnY1FAs7CD32ZSYj7GCFWEuatRERBjFxg%3d&risl=&pid=ImgRaw&r=0"},
          country: "France",
          location: "Paris",
        },
        {
          title: "Charming Houseboat in Amsterdam",
          discription:
            "Stay in a unique houseboat on Amsterdam's famous canals and explore the city.",
          price: 2200,
          image: {
            filename:"listingimage",
            url:"https://th.bing.com/th/id/OIP.QHHa78G_l2rsITczhU11HgHaFj?rs=1&pid=ImgDetMain"},
          country: "Netherlands",
          location: "Amsterdam",
        },
        {
          title: "Mountain Lodge in Banff",
          discription:
            "Retreat to this cozy mountain lodge with stunning views of the Canadian Rockies.",
          price: 1800,
          image: {
            filename:"listingimage",
            url:"https://i.ytimg.com/vi/4oWMSCG-w-Q/maxresdefault.jpg"},
          country: "Canada",
          location: "Banff",
        },
        {
          title: "Safari Camp in Kenya",
          discription:
            "Experience the thrill of African wildlife at this luxurious safari camp.",
          price: 5000,
          image: {
            filename:"listingimage",
            url:"https://th.bing.com/th/id/OIP.d4JU7CS0v5uX-3AQqL4-twAAAA?rs=1&pid=ImgDetMain"},
          country: "Kenya",
          location: "Masai Mara",
        },
        {
          title: "Modern Loft in Berlin",
          discription:
            "Stay in the heart of Berlin in this sleek loft near vibrant cafes and art galleries.",
          price: 1700,
          image: {
            filename:"listingimage",
            url:"https://th.bing.com/th/id/OIP.7ywqvBS-BXU0MD5HD_DkAQHaE7?rs=1&pid=ImgDetMain"},
          country: "Germany",
          location: "Berlin",
        },
        {
          title: "Historic Castle in Ireland",
          discription:
            "Live like royalty in a beautifully restored castle surrounded by lush landscapes.",
          price: 4500,
          image: {
            filename:"listingimage",
            url:"https://cdn.thecrazytourist.com/wp-content/uploads/2018/10/ccimage-shutterstock_76633564.jpg"},
          country: "Ireland",
          location: "County Clare",
        },
        {
          title: "Cozy Chalet in Switzerland",
          discription:
            "Stay in this cozy Swiss chalet with panoramic views of the Alps.",
          price: 3200,
          image: {
            filename:"listingimage",
            url:"https://www.luxurychaletco.com/wp-content/uploads/2022/10/chalet-zermatt-peak-2.jpg"},
          country: "Switzerland",
          location: "Zermatt",
        },
        {
          title: "Cabin on the Great Lakes",
          discription:
            "Escape to this tranquil cabin with private access to the Great Lakes.",
          price: 2000,
          image: {
            filename:"listingimage",
            url:"https://th.bing.com/th/id/OIP.ry3PFqGeQNgL-CRtX7txCAHaEy?rs=1&pid=ImgDetMain"},
          country: "United States",
          location: "Michigan",
        },
        {
          title: "Desert Camp in Morocco",
          discription:
            "Stay under the stars in this luxury desert camp in the Sahara.",
          price: 3000,
          image: {
            filename:"listingimage",
            url:"https://th.bing.com/th/id/OIP.p1ESnR056DPOHq1YnPXp3QHaF3?rs=1&pid=ImgDetMain"},
          country: "Morocco",
          location: "Sahara Desert",
        }
    ];
    
    module.exports = { data: sampleListings };
    