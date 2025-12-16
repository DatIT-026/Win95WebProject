from PIL import Image
import os

if not os.path.exists('thumbs'):
    os.makedirs('thumbs')

for filename in os.listdir('.'):
    if filename.endswith(('.jpg', '.png', '.jpeg')):
        try:
            with Image.open(filename) as img:
                base_width = 1920
                w_percent = (base_width / float(img.size[0]))
                h_size = int((float(img.size[1]) * float(w_percent)))
                img = img.resize((base_width, h_size), Image.Resampling.LANCZOS)
                img.save(f'thumbs/{filename}')
                print(f"Resized {filename}")
        except Exception as e:
            print(f"Error {filename}: {e}")