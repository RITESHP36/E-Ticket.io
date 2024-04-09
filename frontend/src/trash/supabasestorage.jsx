import React from 'react'

const supabasestorage = () => {
    // Uncomment the following code to upload the image to Supabase storage
				/*
				try {
					const filename = `${uuid}-ticket.png`; // Use the UUID and a fixed extension
					const { data, error } = await supabase.storage
						.from("tickets")
						.upload(filename, blob, {
							cacheControl: "3600",
							upsert: false,
						});
	
					if (error) {
						console.error("Error uploading image:", error);
						throw error;
					}
	
					console.log("Image uploaded successfully:", data);
					// Optionally, save the file path in the database
					// You'll need to implement the logic to save the file path
				} catch (error) {
					console.error("Error uploading image:", error);
				}
				*/
  return (
    <div>supabasestorage</div>
  )
}

export default supabasestorage