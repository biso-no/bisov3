"use client"
import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, LayoutGrid, Plus, Filter } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Resizable } from 're-resizable';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { DateRange } from "react-day-picker";
import { loadDashboardConfig, saveDashboardConfig } from '@/lib/server';
import { getTeams, getTeam } from '@/lib/server';
import { Query } from 'node-appwrite';

type UserRole = 'shopManager' | 'contentEditor' | 'pr' | 'Admin';

interface CardType {
  title: string;
  roles: UserRole[];
}

const cardTypes: Record<string, CardType> = {
  revenue: { title: 'Revenue', roles: ['shopManager', 'Admin'] },
  products: { title: 'Products', roles: ['shopManager', 'Admin'] },
  posts: { title: 'Posts', roles: ['contentEditor', 'Admin'] },
  pages: { title: 'Pages', roles: ['contentEditor', 'Admin'] },
  users: { title: 'Users', roles: ['pr', 'Admin'] },
  analytics: { title: 'Analytics', roles: ['Admin'] },
};

interface DashboardCard {
  id: string;
  title: string;
  groupId: string | null;
  order: number;
  width?: number;
  height?: number;
  row?: number;
}

interface Group {
  id: string;
  name: string;
  order: number;
}

export function Dashboard({ userId }: { userId: string }) {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [layout, setLayout] = useState<DashboardCard[]>([]);
  const [availableCards, setAvailableCards] = useState<DashboardCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<DashboardCard[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const fetchTeams = async () => {
      const teams = await getTeams([Query.equal('name', ['admin', 'contentEditor', 'shopManager'])]);
      setUserRoles(teams.teams.map(team => team.name as UserRole));
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    const initializeDashboard = async () => {
      const config = await loadDashboardConfig(userId);
      
      const cards = Object.entries(cardTypes)
        .filter(([_, { roles }]) => roles.some(role => userRoles.includes(role)))
        .map(([key, { title }], index) => ({ id: key, title, groupId: null, order: index }));
      
      setAvailableCards(cards);
      setFilteredCards(cards);

      if (config) {
        setLayout(config.layout || []);
        setGroups(config.groups || []);
      } else {
        const defaultLayout = cards.slice(0, 3).map((card, index) => ({ ...card, order: index }));
        setLayout(defaultLayout);
        setGroups([]);
        await saveDashboardConfig({
          userId,
          newLayout: defaultLayout,
          newGroups: []
        });
      }
    };

    initializeDashboard();
  }, [userRoles, userId]);

  useEffect(() => {
    if (roleFilter === 'all') {
      setFilteredCards(availableCards);
    } else {
      setFilteredCards(availableCards.filter(card => 
        cardTypes[card.id].roles.includes(roleFilter)
      ));
    }
  }, [roleFilter, availableCards]);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const onDragEnd = async (result: any) => {
    const { source, destination, draggableId, type } = result;
    if (!destination) return;

    if (type === 'group') {
      const newGroups = Array.from(groups);
      const [reorderedGroup] = newGroups.splice(source.index, 1);
      newGroups.splice(destination.index, 0, reorderedGroup);
      newGroups.forEach((group, index) => {
        group.order = index;
      });
      await saveLayoutAndGroups(layout, newGroups);
      return;
    }

    const newLayout = Array.from(layout);
    const draggedCardIndex = newLayout.findIndex(card => card.id === draggableId);
    
    if (draggedCardIndex === -1) return; // Card not found, exit

    const [draggedCard] = newLayout.splice(draggedCardIndex, 1);
    const startGroup = source.droppableId;
    const endGroup = destination.droppableId;

    if (endGroup === 'dashboard') {
      draggedCard.groupId = null;
      newLayout.splice(destination.index, 0, draggedCard);
    } else {
      draggedCard.groupId = endGroup;
      const groupCards = newLayout.filter(card => card.groupId === endGroup);
      groupCards.splice(destination.index, 0, draggedCard);
      newLayout.push(...groupCards);
    }

    // Recalculate positions based on new order
    let currentRowWidth = 0;
    let currentRow = 0;
    
    newLayout.forEach((card, index) => {
      if (currentRowWidth + (card.width || 0) > containerWidth) {
        currentRowWidth = card.width || 0;
        currentRow++;
      } else {
        currentRowWidth += card.width || 0;
      }
      card.row = currentRow;
      card.order = index;
    });

    await saveLayoutAndGroups(newLayout, groups);
  };

  const onResize = (cardId: string, size: { width: number; height: number }) => {
    const newLayout = layout.map(card => 
      card.id === cardId ? { ...card, width: size.width, height: size.height } : card
    );
    
    // Recalculate positions based on new sizes
    let currentRowWidth = 0;
    let currentRow = 0;
    
    newLayout.forEach((card, index) => {
      if (currentRowWidth + (card.width || 0) > containerWidth) {
        currentRowWidth = card.width || 0;
        currentRow++;
      } else {
        currentRowWidth += card.width || 0;
      }
      card.row = currentRow;
      card.order = index;
    });

    setLayout(newLayout);
    saveDashboardConfig({ userId, newLayout, newGroups: groups });
  };

  const addCard = async (cardId: string) => {
    const card = availableCards.find(c => c?.id === cardId);
    if (card && !layout.some(c => c?.id === cardId)) {
      const newLayout = [...layout, { ...card, groupId: null, order: layout.length }];
      setLayout(newLayout);
      await saveDashboardConfig({ userId, newLayout, newGroups: groups });
    }
  };
  
  const removeCard = async (cardId: string) => {
    const newLayout = layout.filter(card => card?.id !== cardId)
      .map((card, index) => ({ ...card, order: index }));
    setLayout(newLayout);
    await saveDashboardConfig({ userId, newLayout, newGroups: groups });
  };

  const saveLayoutAndGroups = async (newLayout: DashboardCard[], newGroups: Group[]) => {
    setLayout(newLayout);
    setGroups(newGroups);
    await saveDashboardConfig({ userId, newLayout, newGroups });
  };

  const addGroup = async (groupName: string) => {
    const newGroup = { id: Date.now().toString(), name: groupName, order: groups.length };
    const newGroups = [...groups, newGroup];
    await saveLayoutAndGroups(layout, newGroups);
  };

  const moveCardToGroup = async (cardId: string, groupId: string | null) => {
    const newLayout = layout.map(card => 
      card.id === cardId ? { ...card, groupId } : card
    );
    setLayout(newLayout);
    await saveDashboardConfig({ userId, newLayout, newGroups: groups });
  };

  const formatDateRange = () => {
    if (!dateRange) return 'Select date range';
    if (dateRange.from) {
      if (dateRange.to) {
        return `${dateRange.from.toDateString()} - ${dateRange.to.toDateString()}`;
      }
      return `${dateRange.from.toDateString()} - ...`;
    }
    return 'Select date range';
  };

  const renderGroup = (group: Group, groupCards: DashboardCard[]) => (
    <Droppable droppableId={group.id} type="card">
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={`bg-white p-4 rounded-lg mb-4 transition-colors duration-200 ${
            snapshot.isDraggingOver ? 'bg-blue-100' : ''
          }`}
        >
          <h3 className="font-bold mb-2">{group.name}</h3>
          {groupCards.sort((a, b) => a.order - b.order).map((card, index) => (
            <Draggable key={card.id} draggableId={card.id} index={index}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={`mb-2 transition-shadow duration-200 ${
                    snapshot.isDragging ? 'shadow-lg' : 'shadow'
                  }`}
                >
                  <Card>
                    <CardHeader>{card.title}</CardHeader>
                    <CardContent>Content for {card.title}</CardContent>
                  </Card>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );

  const renderDashboardCards = () => {
    return layout
      .filter(card => card.groupId === null)
      .sort((a, b) => (a.row === b.row ? a.order - b.order : a.row - b.row))
      .map((card, index) => (
        <Draggable key={card.id} draggableId={card.id} index={index}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={`transition-shadow duration-200 ${
                snapshot.isDragging ? 'shadow-2xl' : ''
              }`}
              style={{
                ...provided.draggableProps.style,
                width: card.width || '100%',
                height: card.height || 200,
              }}
            >
              <Resizable
                size={{ width: card.width || '100%', height: card.height || 200 }}
                onResizeStop={(e, direction, ref, d) => {
                  onResize(card.id, {
                    width: (card.width || 0) + d.width,
                    height: (card.height || 0) + d.height,
                  });
                }}
                minHeight={200}
                maxHeight={600}
              >
                <Card className="h-full">
                  <CardHeader className="flex justify-between items-center">
                    <h3 className="font-bold">{card.title}</h3>
                    <Button onClick={() => removeCard(card.id)} variant="ghost" size="sm">Remove</Button>
                  </CardHeader>
                  <CardContent>
                    <div className="h-full flex items-center justify-center">
                      Content for {card.title}
                    </div>
                  </CardContent>
                </Card>
              </Resizable>
            </div>
          )}
        </Draggable>
      ));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Customizable Dashboard</h1>
      
      <div className="flex space-x-4 justify-end mb-6 mr-10">
        <Dialog>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Card</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Card to Dashboard</DialogTitle>
            </DialogHeader>
            <div className="mb-4">
              <Select value={roleFilter} onValueChange={(value: UserRole | 'all') => setRoleFilter(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {userRoles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4">
              {filteredCards.map(card => card && (
                <div key={card.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={card.id} 
                    checked={layout.some(c => c?.id === card.id)}
                    onCheckedChange={(checked) => checked ? addCard(card.id) : removeCard(card.id)} 
                  />
                  <label htmlFor={card.id}>{card.title}</label>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button><LayoutGrid className="mr-2 h-4 w-4" /> Add Group</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Group</DialogTitle>
            </DialogHeader>
            <Input 
              placeholder="Group Name" 
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') addGroup(e.currentTarget.value);
              }} 
            />
          </DialogContent>
        </Dialog>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline"><Calendar className="mr-2 h-4 w-4" />{dateRange ? formatDateRange() : 'Select date range'}</Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 mr-10">
            <CalendarComponent
              mode="range"
              selected={dateRange}
              onSelect={(range: DateRange | undefined) => setDateRange(range)}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="groups" type="group" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {groups.sort((a, b) => a.order - b.order).map((group, index) => (
                <Draggable key={group.id} draggableId={group.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`mb-4 transition-shadow duration-200 ${
                        snapshot.isDragging ? 'shadow-xl' : ''
                      }`}
                    >
                      {renderGroup(group, layout.filter(card => card.groupId === group.id))}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        
        <Droppable droppableId="dashboard" type="card" direction="horizontal">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={(el) => {
                provided.innerRef(el);
                containerRef.current = el;
              }}
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-colors duration-200 ${
                snapshot.isDraggingOver ? 'bg-blue-50' : ''
              }`}
            >
              {renderDashboardCards()}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}