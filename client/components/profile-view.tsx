"use client";

interface ProfileData {
    id?: string;
    image: string | null;
    name: string;
    position: string;
    slug: "both" | "team" | "board";
    bio: string;
}

interface ProfileViewProps {
    profile: ProfileData;
}

export function ProfileView({ profile }: ProfileViewProps) {
    const slugLabel = {
        both: "Both",
        team: "Team",
        board: "Board",
    }[profile.slug];

    return (
        <div className="space-y-6">
            {/* Two Column Layout - Same as Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Left Column - Image */}
                <div>
                    {profile.image && (
                        <div className="w-full h-64 rounded-lg overflow-hidden border border-border">
                            <img
                                src={profile.image || "/placeholder.svg"}
                                alt={profile.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                </div>

                {/* Right Column - Details */}
                <div className="space-y-4">
                    {/* Name */}
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Name
                        </p>
                        <p className="text-lg font-semibold mt-1">
                            {profile.name}
                        </p>
                    </div>

                    {/* Position */}
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Position
                        </p>
                        <p className="text-base mt-1">{profile.position}</p>
                    </div>

                    {/* Type */}
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Type
                        </p>
                        <div className="flex gap-2 mt-1">
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                                {slugLabel}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bio - Full Width */}
            {profile.bio && (
                <div>
                    <p className="text-sm font-medium text-muted-foreground">
                        Bio
                    </p>
                    <p className="text-base mt-2 leading-relaxed text-foreground">
                        {profile.bio}
                    </p>
                </div>
            )}

            {/* JSON Preview */}
            <div className="bg-muted p-4 rounded-lg">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                    Profile Data (JSON)
                </p>
                <pre className="bg-background p-3 rounded text-xs overflow-auto max-h-48 text-foreground">
                    {JSON.stringify(profile, null, 2)}
                </pre>
            </div>
        </div>
    );
}
