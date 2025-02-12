function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function analyzeText() {
    let text = document.getElementById("newsInput").value.trim();
    if (!text) {
        alert("Please enter a prompt to generate an image.");
        return;
    }

    const models = [
        "stabilityai/stable-diffusion-3.5-large",
        "stabilityai/stable-diffusion-3.5-large-turbo",
        "black-forest-labs/FLUX.1-schnell",
        "stabilityai/stable-diffusion-2-1",
        "stable-diffusion-v1-5/stable-diffusion-v1-5",
        "stabilityai/stable-diffusion-xl-base-1.0"
    ];

    const API_URL_BASE = "https://api-inference.huggingface.co/models/";
    const API_KEY = "";

    for (let model of models) {
        try {
            document.getElementById("result").innerHTML += `Generating image using ${model}... ⏳<br>`;

            const response = await fetch(`${API_URL_BASE}${model}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ inputs: text })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);

            document.getElementById("result").innerHTML += `<img src="${imageUrl}" alt="Generated Image using ${model}" class="mt-4 rounded-lg shadow-lg max-w-full h-auto"><br>`;

        } catch (error) {
            console.error(error);
            document.getElementById("result").innerHTML += `<span class="text-red-500">Failed to generate image using ${model}. Check your API key and try again.</span><br>`;
        }

        // Delay to avoid rate limits
        await delay(60000); // 1-minute delay
    }
}
