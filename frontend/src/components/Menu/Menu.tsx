import { useEffect, useState } from 'react';
import { ArtPiece, ConvoContext } from '../../types';

const artPrompts = {
  Spanish: ({
    title,
    year,
    artist,
  }: {
    title: string;
    year: string | number;
    artist: string;
  }) =>
    `Hablamos de la pintura ${title} (${year}) por ${artist}. La conoces? Me gustaría hablar un poco de lo que veo en la pintura`,
};

let artIds: string[] = [];

export default function Menu({
  setConvoContext,
  closeMenu,
  language,
}: {
  setConvoContext: (convoContext: ConvoContext) => void;
  closeMenu: () => void;
  language: string;
}) {
  // const [artIds, setArtIds] = useState<string[]>([]);
  const [selectedArt, setSelectedArt] = useState<string>();
  const [imageDetails, setImageDetails] = useState<ArtPiece>();

  useEffect(() => {
    if (!artIds.length) {
      const getArtIds = async () => {
        const url =
          'https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&medium=Paintings&departmentId=11&q=Painting';
        const req = await fetch(url);
        const body = await req.json();

        artIds = body.objectIDs;

        return body.objectIDs;
      };

      console.log('artIds', artIds.length);

      getArtIds().then((ids) => {
        const randomId = ids[Math.floor(Math.random() * ids.length)];

        setSelectedArt(randomId);
      });
    } else {
      const randomId = artIds[Math.floor(Math.random() * artIds.length)];

      setSelectedArt(randomId);
    }
  }, []);

  useEffect(() => {
    if (!selectedArt) return;

    fetch(
      'https://collectionapi.metmuseum.org/public/collection/v1/objects/' +
        selectedArt
    )
      .then((res) => res.json())
      .then((data) => {
        console.log('setting image details HERE');
        setImageDetails(data);
      });
  }, [selectedArt]);

  const setArtConvoContext = () => {
    if (!imageDetails) return;
    setConvoContext({
      description: `${imageDetails.title} (${imageDetails.objectEndDate}), ${imageDetails.artistDisplayName}`,
      imageUrl: imageDetails.primaryImageSmall,
      name: 'Discuss art',
      prompt: artPrompts[language]?.({
        artist: imageDetails.artistDisplayName,
        title: imageDetails.title,
        year: imageDetails.objectEndDate,
      }) as string,
    });
  };

  return (
    <div>
      <div className="menu flex justify-end p-2">
        <button onClick={closeMenu}>Cancel</button>
      </div>

      <div className="flex flex-col flex-grow max-h-[calc(100vh-8rem)] overflow-auto ">
        <div className="flex flex-col p-2 bg-slate-800 p-2 m-2">
          <h2 className="text-2xl font-bold">Discuss some art</h2>
          <div className="flex">
            <div className="w-56 h-56 flex flex-col justify-between">
              <div className="w-56 h-56 flex flex-col justify-center align-center overflow-hidden">
                <img
                  className="h-full w-full object-contain"
                  src={imageDetails?.primaryImageSmall}
                  alt={imageDetails?.title}
                />
              </div>

              <button
                className="bg-slate-600 text-white p-2 rounded mt-2"
                onClick={() => {
                  const randomId =
                    artIds[Math.floor(Math.random() * artIds.length)];

                  setSelectedArt(randomId);
                }}
              >
                Randomize
              </button>
            </div>

            <div className="flex flex-col px-2 mx-2 rounded">
              <div>
                <code>
                  <span className="font-bold">{imageDetails?.title}</span> (
                  {imageDetails?.objectEndDate})
                </code>
                <br />
                <code>{imageDetails?.artistDisplayName}</code>
              </div>

              <ul className="mt-4">
                <li className="pt-2">Describe what's in the piece</li>
                <li className="pt-2">
                  Talk about what you like about the piece
                </li>
                <li className="pt-2">
                  Play Eye Spy with an object in the piece
                </li>
              </ul>
              <button
                className="self-end bg-violet-600 text-white p-2 rounded mt-2"
                onClick={setArtConvoContext}
              >
                Let's do it
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
