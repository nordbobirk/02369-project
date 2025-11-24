"use client";

import { useState } from "react";
import { TattooImages } from "@/app/dashboard/view_booking/[id]/TattooImages";
import { formatMinutesHrsMins } from "@/app/dashboard/utils/formatMinutes";
import EditTattoo from "@/app/dashboard/view_booking/[id]/EditTattoo";
import SaveEditTattoo from "@/app/dashboard/view_booking/[id]/SaveEditTattoo";
import CancelEditTattoo from "@/app/dashboard/view_booking/[id]/CancelEditTattoo";

export type Tattoo = {
    id: number;
    notes: string;
    width?: number;
    height?: number;
    placement?: string;
    tattoo_type?: string;
    detail_level?: string;
    tattoo_images?: { id: number; image_url: string }[];
    colored_option?: string;
    estimated_price?: number;
    color_description?: string | null;
    estimated_duration?: number;
};

interface TattooInfoProps {
    tattoos: Tattoo[];
}

export function TattooInfo({ tattoos }: TattooInfoProps) {
    const [index, setIndex] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [editedWidth, setEditedWidth] = useState<number | undefined>();
    const [editedHeight, setEditedHeight] = useState<number | undefined>();
    const [editedPlacement, setEditedPlacement] = useState("");
    const [editedDetailLevel, setEditedDetailLevel] = useState("");
    const [editedColoredOption, setEditedColoredOption] = useState("");
    const [editedColorDescription, setEditedColorDescription] = useState("");

    if (!tattoos?.length) {
        return <p>Ingen tatoveringer</p>;
    }

    const tattoo = tattoos[index];

    const handleEdit = () => {
        setEditedWidth(tattoo.width);
        setEditedHeight(tattoo.height);
        setEditedPlacement(tattoo.placement ?? "");
        setEditedDetailLevel(tattoo.detail_level ?? "");
        setEditedColoredOption(tattoo.colored_option ?? "");
        setEditedColorDescription(tattoo.color_description ?? "");
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleSave = async () => {
        setIsEditing(false);
    };

    return (
        <div className="p-2 border border-black rounded-lg flex flex-col md:flex-row gap-4">
            <div className="order-1 md:order-2 md:w-60 w-full">
                <TattooImages images={tattoo.tattoo_images} />
            </div>

            <div className="flex-1 order-2 md:order-1">
                <div className="flex items-center justify-between">
                    <div className="font-medium text-base">
                        Tattoo {index + 1}{" "}
                        <span className="text-sm text-muted-foreground">({tattoo.tattoo_type})</span>
                    </div>
                    {!isEditing ? (
                        <EditTattoo onEditAction={handleEdit} />
                    ) : (
                        <div className="flex gap-2">
                            <SaveEditTattoo
                                tattooId={tattoo.id.toString()}
                                width={editedWidth}
                                height={editedHeight}
                                placement={editedPlacement}
                                detailLevel={editedDetailLevel}
                                coloredOption={editedColoredOption}
                                colorDescription={editedColorDescription}
                                onSaveAction={handleSave}
                            />
                            <CancelEditTattoo onCancelAction={handleCancel} />
                        </div>
                    )}
                </div>

                <div className="text-sm mt-2">
                    <div className="flex flex-col space-y-1">
                        <div className="whitespace-pre-wrap break-words">{tattoo.notes}</div>
                        <div>
                            <span className="font-medium">Størrelse:</span>{" "}
                            {isEditing ? (
                                <>
                                    <input
                                        type="number"
                                        value={editedWidth ?? ""}
                                        onChange={(e) => setEditedWidth(e.target.value ? Number(e.target.value) : undefined)}
                                        placeholder="Bredde"
                                        className="w-20 px-2 py-1 border border-gray-300 rounded"
                                    />
                                    {" x "}
                                    <input
                                        type="number"
                                        value={editedHeight ?? ""}
                                        onChange={(e) => setEditedHeight(e.target.value ? Number(e.target.value) : undefined)}
                                        placeholder="Højde"
                                        className="w-20 px-2 py-1 border border-gray-300 rounded"
                                    />
                                    {" cm"}
                                </>
                            ) : (
                                `${tattoo.width ?? "—"} x ${tattoo.height ?? "—"} cm`
                            )}
                        </div>
                        <div>
                            <span className="font-medium">Placering:</span>{" "}
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedPlacement}
                                    onChange={(e) => setEditedPlacement(e.target.value)}
                                    className="ml-2 px-2 py-1 border border-gray-300 rounded"
                                />
                            ) : (
                                tattoo.placement ?? "—"
                            )}
                        </div>
                        {tattoo.tattoo_type == "custom" ? (
                            <div>
                                <span className="font-medium">Detaljeniveau:</span>{" "}
                                {isEditing ? (
                                    <select
                                        value={editedDetailLevel}
                                        onChange={(e) => setEditedDetailLevel(e.target.value)}
                                        className="ml-2 px-2 py-1 border border-gray-300 rounded"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                ) : (
                                    tattoo.detail_level ?? "—"
                                )}
                            </div>

                        ) :
                            <div className="flex ">
                                <span className="font-medium">Detaljeniveau: </span>
                                <p className="ml-2"> Flash</p>
                            </div>
                        }
                        <div>
                            <span className="font-medium">Farvevalg:</span>{" "}
                            {isEditing ? (
                                <select
                                    value={editedColoredOption}
                                    onChange={(e) => setEditedColoredOption(e.target.value)}
                                    className="ml-2 px-2 py-1 border border-gray-300 rounded"
                                >
                                    <option value="black">Sort</option>
                                    <option value="colored">Farver</option>
                                </select>
                            ) : (
                                tattoo.colored_option ?? "—"
                            )}
                        </div>
                        {(isEditing ? editedColoredOption === "colored" : tattoo.color_description) && (
                            <div>
                                <span className="font-medium">Farvebeskrivelse:</span>{" "}
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedColorDescription}
                                        onChange={(e) => setEditedColorDescription(e.target.value)}
                                        className="ml-2 px-2 py-1 border border-gray-300 rounded w-full"
                                    />
                                ) : (
                                    tattoo.color_description
                                )}
                            </div>
                        )}
                        <div>Est. tid: {formatMinutesHrsMins(tattoo.estimated_duration)} </div>
                        <div>Est. pris: {tattoo.estimated_price ?? "—"} kr</div>
                    </div>
                </div>

                <div className="px-0 pb-0 mt-3 flex justify-between items-center gap-4">
                    <button
                        onClick={() =>
                            setIndex(i =>
                                tattoos.length <= 1 ? 0 : (i - 1 + tattoos.length) % tattoos.length
                            )
                        }
                        disabled={isEditing}
                        className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Previous tattoo"
                    >
                        ←
                    </button>

                    <div className="text-sm text-muted-foreground">
                        {index + 1} / {tattoos.length}
                    </div>

                    <button
                        onClick={() =>
                            setIndex(i =>
                                tattoos.length <= 1 ? 0 : (i + 1) % tattoos.length
                            )
                        }
                        disabled={isEditing}
                        className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Next tattoo"
                    >
                        →
                    </button>
                </div>
            </div>
        </div>
    );
}
